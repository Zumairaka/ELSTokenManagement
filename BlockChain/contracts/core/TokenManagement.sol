// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Errors} from "../libraries/Errors.sol";
import {Events} from "../libraries/Events.sol";
import {Helpers} from "../libraries/Helpers.sol";

/**
* @author Sumaira
* @notice contract for locking and unlocking the ERC20 token
 */

 contract TokenManagement is ReentrancyGuardUpgradeable, OwnableUpgradeable {
    /* State Variables */
    IERC20 private _token;

    /* Mappings */
    mapping(address => uint256) private tokenBalance;

    /* Public Functions */
    /**
     * @notice this function is for initializing the contract
     */
    function initializeLocking(address token_) public initializer {
        // check for zero address
        Helpers._checkAddress(token_);

        __ReentrancyGuard_init();
        __Ownable_init(msg.sender);
        _token = IERC20(token_);
    }

    /* External Admin Functions */
    /**
    * @notice function for updating the token contract
    * @param token new token address 
    * @dev check if the address is zero
    */
    function updateToken(address token) external onlyOwner{
        Helpers._checkAddress(token);

        // emit event
        emit Events.TokenAddressUpdated(token);

        // update the address
        _token = IERC20(token);
    }

    /* External User Functions */
    /**
    * @notice function for sending the tokens to the contract
    * @param amount amount of token
    * @dev check if the amount is zero
    * @dev check if enough balance
    */
    function sendToken(uint256 amount) external nonReentrant {
        Helpers._checkAmount(amount);

        // check balance
        if(_token.balanceOf(msg.sender) < amount){
            revert Errors.NotEnoughTokensToSend();
        }

        // emit event
        emit Events.TokensSent(msg.sender, address(this), amount);

        // update the records
        tokenBalance[msg.sender] += amount;

        // transfer tokens
        _token.transferFrom(msg.sender, address(this), amount);
    }

    /**
    * @notice function for withdrawing the tokens from the contract
    * @param amount amount of token
    * @dev check if the amount is zero
    * @dev check if enough balance
    */
    function withdrawToken(uint256 amount) external nonReentrant {
        Helpers._checkAmount(amount);

        // check balance
        uint256 balance_ = tokenBalance[msg.sender];
        if(balance_ < amount){
            revert Errors.NotEnoughTokensToWithdraw();
        }

        // emit event
        emit Events.TokensSent(address(this), msg.sender, amount);

        // update the records
        balance_ -= amount;
        tokenBalance[msg.sender] = balance_;

        // transfer tokens
        _token.transfer(msg.sender, amount);
    }

    /* External View Funtions */
    /**
    * @notice function for checking the balance
    * @param account account address
     */
     function getBalance(address account) external view returns(uint256) {
        return tokenBalance[account];
     }

     /**
    * @notice function for checking the current token
     */
     function getToken() external view returns(IERC20) {
        return _token;
     }
 }

 
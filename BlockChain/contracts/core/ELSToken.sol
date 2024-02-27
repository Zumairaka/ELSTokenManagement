// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Errors} from "../libraries/Errors.sol";
import {Events} from "../libraries/Events.sol";
import {Helpers} from "../libraries/Helpers.sol";

/**
 * @author Sumaira
 * @dev Contract for minting and burning ELSTokens
 */

contract ELSToken is ERC20Upgradeable, OwnableUpgradeable
{    
    /* Public Functions */
    /**
     * @notice this function is for initializing the contract
     * @dev set the token name, symbol and initial supply
     */
    function initialize() public initializer {
        __ERC20_init("Ethlas Token", "ELS");
        __Ownable_init(msg.sender);

        // initial supply for 100M ELS Tokens
        _mint(msg.sender, 100000000 * 10 ** uint256(decimals()));
    }

    /* External Functions */
    /**
     * @notice function for minting the new ELS tokens
     * @dev only owner can mint tokens
     * @param account account address to which the token has to be minted
     * @param amount amount of tokens to be minted
     */
    function mint(
        address account,
        uint256 amount
    ) external onlyOwner {
        Helpers._checkAddress(account);
        Helpers._checkAmount(amount);

        // mint tokens to the account
        emit Events.ELSTokenMinted(account, amount);
        _mint(account, amount);
    }

    /**
     * @notice function for burning the tokens
     * @dev only owner can burn tokens
     * @param amount amount of tokens to be burnt
     */
    function burn(uint256 amount) external onlyOwner {
        Helpers._checkAmount(amount);

        // check balance
        if (balanceOf(msg.sender) < amount) {
            revert Errors.NotEnoughBalanceToBurn();
        }

        // burn tokens
        emit Events.ELSTokenBurnt(amount);
        _burn(msg.sender, amount);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}

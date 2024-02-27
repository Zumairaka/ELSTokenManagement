// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library Events {
    /* ELS TOKEN EVENTS */

    /**
     * @notice emitted when the ELS token is minted
     * @param account address to which the token is minted
     * @param amount amount of tokens to be minted
     */
    event ELSTokenMinted(address indexed account, uint256 amount);

    /**
     * @notice emitted when the ELS token is burnt
     * @param amount amount of tokens to be burned
     */
    event ELSTokenBurnt(uint256 amount);

    /* TOKEN MANAGEMENT EVENTS */
    /**
     * @notice emitted when the token address is modified
     * @param token new token address
     */
    event TokenAddressUpdated(address indexed token);

    /**
     * @notice emitted when the token is send to the contract
     * @param from from account address
     * @param to to account address
     * @param amount amount of token
     */
    event TokensSent(address indexed from, address indexed to, uint256 amount);
}

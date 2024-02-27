// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library Errors {
    /* ELS Minting */
    error NotEnoughBalanceToBurn();

    /* Helpers */
    error ZeroAddress();
    error ZeroAmount();

    /* Token Management */
    error NotEnoughTokensToSend();
    error NotEnoughTokensToWithdraw();
}

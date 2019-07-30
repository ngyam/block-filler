pragma solidity ^0.5.10;


contract SlowFiller {

    function loop() public view {

        uint g = gasleft();

        while(g > 250) {
            assembly{
                pop(blockhash(balance(mulmod(
                    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
                    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
                    1
                ))))
                pop(blockhash(balance(mulmod(
                    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
                    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
                    1
                ))))
                pop(blockhash(balance(mulmod(
                    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
                    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
                    1
                ))))
                pop(blockhash(balance(mulmod(
                    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
                    0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
                    1
                ))))
            }
            g = gasleft();
        }
    }
}

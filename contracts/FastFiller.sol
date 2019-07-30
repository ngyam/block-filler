pragma solidity ^0.5.10;


contract FastFiller {

    function loop_ripemd160_1()
        external
        view
        returns (bytes20)
    {
        bytes memory _input = "";
        uint g = gasleft();
        while(g > 1000) {
            ripemd160(_input);
            g = gasleft();
        }
    }

    function loop_ripemd160_2(bytes calldata _input)
        external
        view
    {
        uint g = gasleft();
        uint limit = 1000 + (_input.length * 15 / 4);
        while(g > limit) {
            ripemd160(_input);
            g = gasleft();
        }
    }
}

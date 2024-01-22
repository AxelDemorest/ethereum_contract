pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import {PornCoin} from "./tokens/Token.sol";

contract CrowdSale is Ownable {
    PornCoin public token;
    uint256 public tokenPrice;
    uint256 public openingTime; // Moment de l'ouverture de la levée de fond
    uint256 public closingTime; // Moment de la fermeture de la levée de fond

    constructor(
        PornCoin _token,
        uint256 _tokenPrice,
        uint256 _openingTime,
        uint256 _closingTime
    ) Ownable(msg.sender) { // Appel du constructeur de Ownable avec l'adresse du propriétaire initial
        token = _token;
        tokenPrice = _tokenPrice;
        openingTime = _openingTime;
        closingTime = _closingTime;
    }

    function getToken() public view returns (uint) {
        return token.balanceOf(address(this));
    }

    // Événement déclenché lorsqu'un utilisateur achète des tokens
    modifier onlyWhileOpen {
        require(block.timestamp >= openingTime && block.timestamp <= closingTime, "La levee de fonds n'est pas terminee");
        _;
    }

    // Événement déclenché lorsqu'un utilisateur achète des tokens
    modifier onlyWhileClosed {
        require(block.timestamp > closingTime, "La levee de fonds n'est pas terminee");
        _;
    }

    // Fonction permettant à un utilisateur d'acheter des tokens en échange d'Ether
    function purchaseTokens() external payable onlyWhileOpen {
        // Calcule le coût en Ether
        uint256 tokenAmount = msg.value * tokenPrice;
        // Transfère les tokens à l'acheteur
        token.transfer(msg.sender, tokenAmount);
    }

    // Fonction permettant au propriétaire de récupérer les eithers restants
    function withdrawEther() external onlyOwner onlyWhileClosed {
        payable(owner()).transfer(address(this).balance); // Transfère l'Ether au propriétaire
    }

    // Fonction permettant au propriétaire de récupérer les tokens restants
    function withdrawTokens() external onlyOwner onlyWhileClosed {
        token.transfer(owner(), token.balanceOf(address(this))); // Transfère les tokens au propriétaire
    }
}

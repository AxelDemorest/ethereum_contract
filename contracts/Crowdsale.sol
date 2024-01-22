pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdSale is Ownable {
    ERC20 public token;
    uint256 public tokenPrice;
    uint256 public openingTime; // Moment de l'ouverture de la levée de fond
    uint256 public closingTime; // Moment de la fermeture de la levée de fond

    constructor(ERC20 _token, uint256 _tokenPrice, uint256 _openingTime, uint256 _closingTime) {
        token = _token; // Définition de l'adresse du token ERC20
        tokenPrice = _tokenPrice; // Définition du prix du token
        openingTime = _openingTime; // Définition du moment de début de la levée de fonds
        closingTime = _closingTime; // Définition du moment de fin de la levée de fonds
    }

    // Événement déclenché lorsqu'un utilisateur achète des tokens
    modifier onlyWhileOpen {
        require(block.timestamp >= openingTime && block.timestamp <= closingTime, "La levée de fond n'est pas ouverte");
        _;
    }

    // Événement déclenché lorsqu'un utilisateur achète des tokens
    modifier onlyWhileClosed {
        require(block.timestamp > closingTime, "La levée de fond n'est pas terminée");
        _;
    }

    // Fonction permettant à un utilisateur d'acheter des tokens en échange d'Ether
    function purchaseTokens(uint256 tokenAmount) external payable onlyWhileOpen {
        require(tokenAmount > 0, "Le montant de tokens doit être supérieur à zéro"); // Vérifie que l'acheteur a envoyé au moins 1 token
        require(msg.value >= tokenAmount * tokenPrice, "Montant Ether insuffisant"); // Vérifie que l'acheteur a envoyé assez d'Ether
        // msg.value est le montant d'Ether envoyé par l'acheteur

        // Calcule le coût en Ether
        uint256 cost = tokenAmount * tokenPrice;

        // Transfère les tokens à l'acheteur
        token.transfer(msg.sender, tokenAmount);

        // Transfère l'Ether au propriétaire
        payable(owner()).transfer(cost);
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

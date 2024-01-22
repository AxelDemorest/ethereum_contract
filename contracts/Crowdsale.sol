pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdSale is Ownable {
    ERC20 public token;
    uint256 public tokenPrice;
    uint256 public openingTime; // Moment de l'ouverture de la levée de fond
    uint256 public closingTime; // Moment de la fermeture de la levée de fond

    // Fonction permettant à un utilisateur d'acheter des tokens en échange d'Ether
    function purchaseTokens(uint256 tokenAmount) external payable {
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
}

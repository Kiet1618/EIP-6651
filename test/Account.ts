import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect} from "chai";
import hre from "hardhat";

describe("Account", function () {
    async function deployAccountFixture() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();
    
        const account = await hre.viem.deployContract("ERC6551Account", []);
    
        const publicClient = await hre.viem.getPublicClient();
    
        return {
            account,
            owner,
            otherAccount,
            publicClient,
        };
      }
      async function deployNFTFixture() {
        const NAME = "MyNFT";
        const SYMBOL = "NFT";

        const [owner, otherAccount] = await hre.viem.getWalletClients();
    
        // Contracts are deployed using the first signer/account by default
    
        const nft = await hre.viem.deployContract("MyNFT", [NAME, SYMBOL]);
    
        const publicClient = await hre.viem.getPublicClient();
    
        return {
            nft,
            owner,
            otherAccount,
            publicClient,
        };
      }

    describe("Deployment", function () {
        it("Should set the right name", async function () {
          const { nft } = await loadFixture(deployNFTFixture);
    
          expect(await nft.read.name()).to.equal("MyNFT");
        });
    
        it("Should set the right symbol", async function () {
          const { nft } = await loadFixture(deployNFTFixture);
    
          expect(await nft.read.symbol()).to.equal("NFT");
        });
      }
    );

    describe("Deployment", function () {
        it("Should set the right balance", async function () {
          const { account } = await loadFixture(deployAccountFixture);
          expect(await account.read.state()).to.equal(BigInt(0));
        });
    });
    
    describe("Minting and execute", function () {
        it("Should mint a new token and execute a transaction", async function () {
            const { account } = await loadFixture(deployAccountFixture);
            const { nft, owner } = await loadFixture(deployNFTFixture);
            await nft.write.mint([owner.account.address, BigInt(1), '']);

            await nft.write.mint([owner.account.address, BigInt(2), '']);

            await nft.write.approve([owner.account.address, BigInt(1)]);

            await nft.write.transferFrom([owner.account.address, account.address, BigInt(1)]);
    
            const expectedOwner = owner.account.address.toLowerCase(); 
            const actualOwner = (await nft.read.ownerOf([BigInt(1)])).toLowerCase(); 

            await account.write.execute([nft.address, BigInt(1), owner.account.address, 1]);
            expect(actualOwner).to.equal(expectedOwner);
        });
    });
});


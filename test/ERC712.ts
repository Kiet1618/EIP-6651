import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
  import { expect} from "chai";
  import hre from "hardhat";

  describe("MyNFT", function () {
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

    describe("Minting", function () {
        it("Should mint a new token", async function () {
            const { nft, owner } = await loadFixture(deployNFTFixture);
            await nft.write.mint([owner.account.address, BigInt(1), '']);
    
            const expectedOwner = owner.account.address.toLowerCase(); 
            const actualOwner = (await nft.read.ownerOf([BigInt(1)])).toLowerCase(); 
    
            expect(actualOwner).to.equal(expectedOwner);
        });
    });

    describe("Transfer", function () {
        it("Should transfer a token", async function () {
            const { nft, owner, otherAccount } = await loadFixture(deployNFTFixture);
            await nft.write.mint([owner.account.address, BigInt(1), '']);
            await nft.write.approve([owner.account.address, BigInt(1)]);
            await nft.write.transferFrom([owner.account.address, otherAccount.account.address, BigInt(1)]);
    
            const expectedOwner = otherAccount.account.address.toLowerCase(); 
            const actualOwner = (await nft.read.ownerOf([BigInt(1)])).toLowerCase(); 
    
            expect(actualOwner).to.equal(expectedOwner);
        });
    });
  });
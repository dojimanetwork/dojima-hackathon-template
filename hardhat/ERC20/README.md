# dojima-hackathon

#### Setup genesis

#### Make sure your node version is >18.0.0

Setup genesis whenever contracts get changed
### 1. Install dependencies and submodules
```bash
$ npm install

```

### 2. Compile contracts
```bash
#installation of npm v18.0.0 is required
$ npx hardhat compile
```
Should get the output similar to
```bash
Compiled 1 Solidity file successfully (evm target: paris).
```

### 3. Testing Contracts
```bash
$ npx hardhat test
```
Should get the output similar to
```bash
Token contract
    ✓ Deployment should assign the total supply of tokens to the owner (654ms)


  1 passing (663ms)
```

### 4. Deploy Contracts to Dojima Chain
```bash
$ npx hardhat run scripts/deploy.js --network dojima_chain_devnet
```


### PR Submission Guidelines

1. Fork `dojima-hackathon-template` repository
2. Create a new folder with `team-name` inside ``hackathon/<hackathon-name>`` folder in main branch
3. Copy your entire project repository and add a `README` file.
4. `README` file should contain the following:
```markdown
1. Project name and its members
2. Description
3. Tag-line (if-any)
4. Logo (optional)
5. Steps to follow for testing the project
6. Deployed contract address on top of DOJIMA blockchain
```
5. Submit a `Pull Request` to this repository with your changes.
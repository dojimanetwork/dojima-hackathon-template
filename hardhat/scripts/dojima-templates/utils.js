const fs = require('fs')
const reader = require('readline-sync');

function getRootContractAddresses() {
  return JSON.parse(fs.readFileSync(`${process.cwd()}/rootContracts.json`).toString())
}

function getChildContractAddresses() {
    return JSON.parse(fs.readFileSync(`${process.cwd()}/childContracts.json`).toString())
}

function writeRootContractAddresses(contractAddresses) {
    printLog('Writing root contract addresses to file...')
  fs.writeFileSync(
    `${process.cwd()}/rootContracts.json`,
    JSON.stringify(contractAddresses, null, 2) // Indent 2 spaces
  )
}

function writeChildContractAddresses(contractAddresses) {
    printLog('Writing child contract addresses to file...')
    fs.writeFileSync(
        `${process.cwd()}/childContracts.json`,
        JSON.stringify(contractAddresses, null, 2) // Indent 2 spaces
    )
}

const generateConfigFolder = "gen-configs"
function writeContractAddresses(contractAddresses, filename ) {
    // join filename with .json extension
    const directory = `${generateConfigFolder}/${filename}.json`

    printLog('Writing deployed contract addresses ...')
    fs.writeFileSync(
        `${process.cwd()}/${directory}`,
        JSON.stringify(contractAddresses, null, 2) // Indent 2 spaces
    )

    printLog(`Deployed contract addresses written to ${directory}`)
}

function printLog(log) {
  console.log(JSON.stringify({ log }, null, 2));
}

function printObj(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

module.exports = {
    getContractAddresses: getRootContractAddresses,
    getChildContractAddresses,
    writeRootContractAddresses,
    writeChildContractAddresses,
    printLog,
    printObj,
    writeContractAddresses,
    confirm(values, complete) {
        module.exports.printObj({ 'environment_variables:': values });

        if (!complete) {
            console.error(
                `One or more of the required environment variable not defined. Make sure to declare these variables in an .env file.`,
            );
            process.exit(1);
        }

        if (values?.SKIP_CONFIRM === 'true') {
            return;
        }

        const answer = reader.question(
            '\n' + JSON.stringify({ log: "ensure the values above are correct, and if so press 'y' to continue" }) + '\n',
        );

        if (!answer) {
            module.exports.printLog('execution cancelled');
            process.exit(0);
        }
    },
}
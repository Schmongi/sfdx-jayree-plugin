"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * Copyright (c) 2020, jayree
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const command_1 = require("@salesforce/command");
const adm_zip_1 = tslib_1.__importDefault(require("adm-zip"));
const convert = tslib_1.__importStar(require("xml-js"));
command_1.core.Messages.importMessagesDirectory(__dirname);
const messages = command_1.core.Messages.loadMessages('sfdx-jayree', 'getpackagedescription');
class GetPackageDescription extends command_1.SfdxCommand {
    // eslint-disable-next-line @typescript-eslint/require-await
    async run() {
        const inputfile = this.args.file || this.flags.file;
        const zip = new adm_zip_1.default(inputfile);
        const zipEntries = zip.getEntries();
        let text;
        zipEntries.forEach((zipEntry) => {
            const fileName = zipEntry.entryName;
            if (fileName.includes('package.xml')) {
                const fileContent = zip.readAsText(fileName);
                text = convert.xml2js(fileContent, { compact: true });
                if ('description' in text['Package']) {
                    text = text['Package']['description']['_text'];
                    this.ux.log(text);
                }
                else {
                    text = '';
                }
            }
        });
        return { description: text };
    }
}
exports.default = GetPackageDescription;
// hotfix to receive only one help page
// public static hidden = true;
GetPackageDescription.description = messages.getMessage('commandDescription');
GetPackageDescription.examples = [
    `$ sfdx jayree:packagedescription:get --file FILENAME
    Description of Package FILENAME
    `,
];
GetPackageDescription.args = [{ name: 'file' }];
GetPackageDescription.flagsConfig = {
    file: command_1.flags.string({
        char: 'f',
        description: messages.getMessage('fileFlagDescription'),
        required: true,
    }),
};
GetPackageDescription.requiresUsername = false;
GetPackageDescription.supportsDevhubUsername = false;
GetPackageDescription.requiresProject = false;
//# sourceMappingURL=get.js.map
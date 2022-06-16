import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);

export { unlinkFile };

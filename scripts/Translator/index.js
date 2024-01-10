const fs = require(`fs`);
const CSVtoJSON = require(`./CSVtoJSON`);
const JSONtoCSV = require(`./JSONtoCSV`);
const isExistCheck = require(`./isExistCheck`);

const TRANSLATORS = `public/translator`;
const LOCALES = `public/locales`;
const nullish = `:empty:`;
const comma = `:comma:`; // TODO: Need to replace "," as they're CSV Separators

function generatePaths() {
  const locales = fs.readdirSync(LOCALES).filter((locale) => {
    const isTranslationExist = isExistCheck(
      `${LOCALES}/${locale}/translation.json`,
    );

    if (!isTranslationExist) {
      console.error(`   ❌ ${LOCALES}/${locale}/translation.json: not found`);
      return isTranslationExist;
    }

    console.log(`   ✅ ${LOCALES}/${locale}/translation.json: Found`);
    return isTranslationExist;
  });

  return locales.map((locale) => `${LOCALES}/${locale}/translation.json`);
}

function generateDirectories(translators) {
  if (!isExistCheck(TRANSLATORS)) {
    fs.mkdirSync(TRANSLATORS);
  }

  translators.forEach((translator) => {
    const targetPath = translator.replace(`/translation.csv`, ``);

    try {
      fs.mkdirSync(targetPath);
    } catch (error) {
      if (error.code === `EEXIST`) {
        console.log(`💡 ${targetPath} already exist. Skipping...`);
        return;
      }

      console.error(error);
    }
  });
}

(function Translator() {
  const type = process.argv[2];
  const locales = generatePaths();
  const translators = locales.map((locale) => {
    return locale.replace(`locales`, `translator`).replace(`.json`, `.csv`);
  });

  console.log(` `);
  console.log(`💽 Running Translator...`);
  console.log(`💽 Reading existing locales...`);
  console.log(` `);
  console.log(`🔍 Looking for destination directory...`);

  const isTranslatorsExist = translators.filter((translator) => {
    return isExistCheck(translator);
  });

  if (isTranslatorsExist.length === locales.length) {
    console.log(`  ✅ [public/translator]: Found`);
  } else {
    console.log(`  ❌ [public/translator]: Not Found`);
    console.log(`⚙️ Creating Directories...`);
    console.log(` `);

    generateDirectories(translators);
  }

  console.log(`🚀 Starting Conversion...`);

  if (type === `to-json`) {
    locales.forEach((locale) => {
      const source = locale
        .replace(`locales`, `translator`)
        .replace(`translation.json`, `translation.csv`);
      const destination = locale.replace(`locales`, `translator`);

      CSVtoJSON(source, destination, nullish);
    });
  } else if (type === `to-csv`) {
    locales.forEach((locale) => {
      const source = locale;
      const destination = locale
        .replace(`locales`, `translator`)
        .replace(`translation.json`, `translation.csv`);

      JSONtoCSV(source, destination, nullish);
    });
  } else {
    console.error(`🚨 Supported Types: "to-json" or "to-csv" 🚨`);
  }
})();

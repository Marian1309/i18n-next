const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");

/**
 * Recursively find all .js files in a directory
 */
function findJsFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    console.log('❌ dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (path.extname(item) === ".js") {
        files.push(fullPath);
      }
    }
  }

  scanDirectory(dir);
  return files;
}

/**
 * Obfuscate a single JavaScript file
 */
function obfuscateFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");

    const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
      // Compact code
      compact: true,

      // Control flow flattening
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,

      // Dead code injection
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,

      // Debug protection
      debugProtection: false, // Keep false for better compatibility
      debugProtectionInterval: 0,

      // Disable console output
      disableConsoleOutput: false, // Keep false to preserve legitimate console usage

      // Domain lock (leave empty for general use)
      domainLock: [],
      domainLockRedirectUrl: "about:blank",

      // Force transform strings
      forceTransformStrings: [],

      // Identifier names generator
      identifierNamesGenerator: "hexadecimal",

      // Log level
      log: false,

      // Numbers to expressions
      numbersToExpressions: true,

      // Options preset
      optionsPreset: "default",

      // Rename globals
      renameGlobals: false, // Keep false to avoid breaking React/Next.js globals

      // Rename properties
      renameProperties: false, // Keep false to avoid breaking object properties
      renamePropertiesMode: "safe",

      // Reserved names (important for React/Next.js compatibility)
      reservedNames: [
        "React",
        "ReactDOM",
        "useState",
        "useEffect",
        "useContext",
        "useCallback",
        "useMemo",
        "useRef",
        "useReducer",
        "createContext",
        "forwardRef",
        "memo",
        "lazy",
        "Suspense",
        "Fragment",
        "StrictMode",
        "Component",
        "PureComponent",
        "createElement",
        "cloneElement",
        "isValidElement",
        "default",
        "exports",
        "module",
        "require",
        "__esModule",
        "Object",
        "Array",
        "String",
        "Number",
        "Boolean",
        "Function",
        "Error",
        "Promise",
        "console",
        "window",
        "document",
        "global",
        "process",
      ],

      // Reserved strings
      reservedStrings: [],

      // Rotate array
      rotateArray: true,

      // Seed
      seed: 0,

      // Self defending
      selfDefending: false, // Keep false for better compatibility

      // Shuffle array
      shuffleArray: true,

      // Simplify
      simplify: true,

      // Source map
      sourceMap: false,
      sourceMapBaseUrl: "",
      sourceMapFileName: "",
      sourceMapMode: "separate",

      // Split strings
      splitStrings: true,
      splitStringsChunkLength: 10,

      // String array
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayCallsTransformThreshold: 0.5,
      stringArrayEncoding: ["base64"],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: "variable",
      stringArrayThreshold: 0.75,

      // Target
      target: "browser",

      // Transform object keys
      transformObjectKeys: false, // Keep false to avoid breaking object properties

      // Unicode escape sequence
      unicodeEscapeSequence: false,
    });

    fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
    console.log(`✅ Obfuscated: ${path.relative(process.cwd(), filePath)}`);
  } catch (error) {
    console.error(`❌ Failed to obfuscate ${filePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Main obfuscation process
 */
function main() {
  console.log("🔒 Starting JavaScript obfuscation...\n");

  const jsFiles = findJsFiles(distDir);

  if (jsFiles.length === 0) {
    console.log("⚠️  No JavaScript files found in dist directory.");
    return;
  }

  console.log(`Found ${jsFiles.length} JavaScript file(s) to obfuscate:\n`);

  jsFiles.forEach((file) => {
    console.log(`📁 ${path.relative(process.cwd(), file)}`);
  });

  console.log("\n🔄 Obfuscating files...\n");

  jsFiles.forEach(obfuscateFile);

  console.log(`\n🎉 Successfully obfuscated ${jsFiles.length} file(s)!`);
  console.log(
    "💡 TypeScript declaration files (.d.ts) were preserved for library consumers."
  );
}

// Run the obfuscation
main();

const fs = require("fs");
const path = require("path");
const { minify } = require("terser");
const JavaScriptObfuscator = require("javascript-obfuscator");

// Aggressive obfuscation configuration
const AGGRESSIVE_OBFUSCATION_CONFIG = {
  // String obfuscation
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayCallsTransformThreshold: 1,
  stringArrayEncoding: ["rc4"],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 5,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 5,
  stringArrayWrappersType: "function",
  stringArrayThreshold: 1,

  // Control flow obfuscation
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 1,

  // Variable and function name obfuscation
  identifierNamesGenerator: "hexadecimal",
  renameGlobals: false, // Keep false to maintain exports
  renameProperties: false, // Keep false to maintain API compatibility

  // Advanced transformations
  transformObjectKeys: true,
  unicodeEscapeSequence: true,
  selfDefending: true,
  debugProtection: true,
  debugProtectionInterval: 2000,
  disableConsoleOutput: true,

  // Code structure obfuscation
  splitStrings: true,
  splitStringsChunkLength: 5,
  numbersToExpressions: true,
  simplify: true,

  // Performance vs Security balance
  compact: true,
  target: "node",

  // Anti-debugging
  domainLock: [], // Can add specific domains if needed
  reservedNames: [], // Keep empty to allow maximum obfuscation
  seed: Math.floor(Math.random() * 1000000), // Random seed for each build
};

// Medium obfuscation for better performance
const MEDIUM_OBFUSCATION_CONFIG = {
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayThreshold: 0.75,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  identifierNamesGenerator: "hexadecimal",
  renameGlobals: false,
  renameProperties: false,
  transformObjectKeys: true,
  compact: true,
  target: "node",
};

async function terserMinify(code) {
  const result = await minify(code, {
    mangle: {
      toplevel: true,
      properties: false,
    },
    compress: {
      dead_code: true,
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ["console.log", "console.warn", "console.error"],
      passes: 3,
    },
    format: {
      comments: false,
      beautify: false,
    },
    keep_classnames: false,
    keep_fnames: false,
  });

  return result.code;
}

async function obfuscateFile(filePath, level = "aggressive") {
  try {
    const code = fs.readFileSync(filePath, "utf8");

    // First pass: Terser minification
    let processedCode = await terserMinify(code);

    // Second pass: JavaScript Obfuscation
    const config =
      level === "aggressive"
        ? AGGRESSIVE_OBFUSCATION_CONFIG
        : MEDIUM_OBFUSCATION_CONFIG;
    const obfuscationResult = JavaScriptObfuscator.obfuscate(
      processedCode,
      config
    );

    fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
    console.log(
      `🔒 ${level} obfuscation applied: ${path.relative(
        process.cwd(),
        filePath
      )}`
    );
  } catch (error) {
    console.error(`❌ Failed to obfuscate ${filePath}:`, error.message);
  }
}

async function obfuscateDirectory(dirPath, level = "aggressive") {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await obfuscateDirectory(fullPath, level);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      await obfuscateFile(fullPath, level);
    }
  }
}

async function main() {
  const distPath = path.join(__dirname, "..", "dist");
  const level = process.argv[2] || "aggressive"; // 'aggressive' or 'medium'

  if (!fs.existsSync(distPath)) {
    console.error('❌ dist directory not found. Run "tsc" first.');
    process.exit(1);
  }

  console.log(`🔒 Starting ${level} code obfuscation...`);
  console.log("⚠️  This may take a few moments for aggressive obfuscation...");

  await obfuscateDirectory(distPath, level);

  console.log(`✅ ${level} code obfuscation complete!`);
  console.log(
    "🛡️  Your code is now heavily protected against reverse engineering."
  );
}

main().catch(console.error);

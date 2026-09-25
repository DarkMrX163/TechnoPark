import fs from 'fs';
import path from 'path';

// Helper to shuffle array with seeded/random distribution
function shuffleWithTarget(options: string[], oldCorrectIdx: number, targetIdx: number): { options: string[], correctIndex: number } {
  const correctVal = options[oldCorrectIdx];
  const wrongVals = options.filter((_, i) => i !== oldCorrectIdx);
  
  // Shuffle wrong answers
  for (let i = wrongVals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongVals[i], wrongVals[j]] = [wrongVals[j], wrongVals[i]];
  }
  
  const result: string[] = [];
  let wrongPtr = 0;
  for (let i = 0; i < 4; i++) {
    if (i === targetIdx) {
      result.push(correctVal);
    } else {
      result.push(wrongVals[wrongPtr++]);
    }
  }
  
  return { options: result, correctIndex: targetIdx };
}

function processFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Find each question block
  // options: [...],\n    correctIndex: 0,
  let targetPattern = 0;
  const patternCounts = [0, 0, 0, 0];
  
  const updated = content.replace(
    /options:\s*\[([\s\S]*?)\],\s*correctIndex:\s*(\d+)/g,
    (match, optionsBody, oldIdxStr) => {
      // Parse options array strings
      const rawOptions: string[] = [];
      const optionRegex = /'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"/g;
      let optMatch;
      while ((optMatch = optionRegex.exec(optionsBody)) !== null) {
        rawOptions.push(optMatch[1] ?? optMatch[2]);
      }
      
      if (rawOptions.length !== 4) {
        console.warn('Warning: found question with length !== 4:', rawOptions.length);
        return match;
      }
      
      const oldCorrect = parseInt(oldIdxStr, 10);
      const newCorrect = (targetPattern++) % 4; // distribute evenly 0, 1, 2, 3 (A, B, C, D)
      patternCounts[newCorrect]++;
      
      const { options, correctIndex } = shuffleWithTarget(rawOptions, oldCorrect, newCorrect);
      
      const formattedOptions = options.map(o => {
        // escape single quotes
        const escaped = o.replace(/'/g, "\\'");
        return `'${escaped}'`;
      }).join(', ');
      
      return `options: [${formattedOptions}],\n    correctIndex: ${correctIndex}`;
    }
  );
  
  fs.writeFileSync(filePath, updated, 'utf-8');
  console.log(`Updated ${filePath}. Distribution:`, patternCounts);
}

processFile(path.join(process.cwd(), 'src/data/questions/vr.ts'));
processFile(path.join(process.cwd(), 'src/data/questions/robotics.ts'));
processFile(path.join(process.cwd(), 'src/data/questions/lego.ts'));

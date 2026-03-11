import { MatrixData } from '../types';

const SHAPES = ['○', '□', '△', '◇', '★', '●', '■', '▲', '◆'];
const FILLS = ['░', '▒', '▓', '█'];

type ShapeCode = 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'hexagon' | 'cross' | 'arrow';
type FillCode = 'empty' | 'half' | 'full' | 'dot';

interface Cell {
  shape: ShapeCode;
  fill: FillCode;
  size: 'small' | 'medium' | 'large';
  rotation: number; // 0, 90, 180, 270
}

type MatrixRule =
  | 'shape_sequence'
  | 'fill_progression'
  | 'size_progression'
  | 'rotation_sequence'
  | 'count_progression';

interface MatrixPuzzle {
  grid: (Cell | null)[][];
  answer: Cell;
  distractors: Cell[];
  rule: string;
  ruleCode: MatrixRule;
}

const SHAPE_CODES: ShapeCode[] = ['circle', 'square', 'triangle', 'diamond', 'star', 'hexagon', 'cross', 'arrow'];
const FILL_CODES: FillCode[] = ['empty', 'half', 'full', 'dot'];
const SIZES: Cell['size'][] = ['small', 'medium', 'large'];
const ROTATIONS = [0, 90, 180, 270];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cellToSvg(cell: Cell | null, x: number, y: number, cellSize: number): string {
  if (!cell) return '';
  const cx = x + cellSize / 2;
  const cy = y + cellSize / 2;
  const sizeMap = { small: 0.25, medium: 0.35, large: 0.45 };
  const r = cellSize * sizeMap[cell.size];

  const fillMap: Record<FillCode, string> = {
    empty: 'none',
    half: 'rgba(255,255,255,0.4)',
    full: 'rgba(255,255,255,0.85)',
    dot: 'rgba(255,255,255,0.6)',
  };
  const strokeColor = 'rgba(255,255,255,0.9)';
  const fill = fillMap[cell.fill];
  const transform = cell.rotation !== 0 ? ` transform="rotate(${cell.rotation} ${cx} ${cy})"` : '';

  switch (cell.shape) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${strokeColor}" stroke-width="2"${transform}/>`;
    case 'square': {
      const side = r * 1.8;
      return `<rect x="${cx - side / 2}" y="${cy - side / 2}" width="${side}" height="${side}" fill="${fill}" stroke="${strokeColor}" stroke-width="2"${transform}/>`;
    }
    case 'triangle': {
      const pts = `${cx},${cy - r} ${cx - r * 0.866},${cy + r * 0.5} ${cx + r * 0.866},${cy + r * 0.5}`;
      return `<polygon points="${pts}" fill="${fill}" stroke="${strokeColor}" stroke-width="2"${transform}/>`;
    }
    case 'diamond': {
      const pts = `${cx},${cy - r} ${cx + r * 0.7},${cy} ${cx},${cy + r} ${cx - r * 0.7},${cy}`;
      return `<polygon points="${pts}" fill="${fill}" stroke="${strokeColor}" stroke-width="2"${transform}/>`;
    }
    case 'star': {
      const outerR = r;
      const innerR = r * 0.45;
      const points = [];
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? outerR : innerR;
        points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
      }
      return `<polygon points="${points.join(' ')}" fill="${fill}" stroke="${strokeColor}" stroke-width="2"${transform}/>`;
    }
    case 'hexagon': {
      const points = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 6;
        points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return `<polygon points="${points.join(' ')}" fill="${fill}" stroke="${strokeColor}" stroke-width="2"${transform}/>`;
    }
    case 'cross': {
      const w = r * 0.35;
      const path = `M ${cx - r} ${cy - w} L ${cx - w} ${cy - w} L ${cx - w} ${cy - r} L ${cx + w} ${cy - r} L ${cx + w} ${cy - w} L ${cx + r} ${cy - w} L ${cx + r} ${cy + w} L ${cx + w} ${cy + w} L ${cx + w} ${cy + r} L ${cx - w} ${cy + r} L ${cx - w} ${cy + w} L ${cx - r} ${cy + w} Z`;
      return `<path d="${path}" fill="${fill}" stroke="${strokeColor}" stroke-width="2"${transform}/>`;
    }
    case 'arrow': {
      const w = r * 0.3;
      const path = `M ${cx} ${cy - r} L ${cx + r * 0.6} ${cy} L ${cx + w} ${cy} L ${cx + w} ${cy + r} L ${cx - w} ${cy + r} L ${cx - w} ${cy} L ${cx - r * 0.6} ${cy} Z`;
      return `<path d="${path}" fill="${fill}" stroke="${strokeColor}" stroke-width="2"${transform}/>`;
    }
    default:
      return '';
  }
}

function generateShapeSequencePuzzle(): MatrixPuzzle {
  const shapes = SHAPE_CODES.slice(0, 6);
  const s1 = randomFrom(shapes);
  const s2 = randomFrom(shapes.filter((s) => s !== s1));
  const s3 = randomFrom(shapes.filter((s) => s !== s1 && s !== s2));
  const fill = randomFrom(FILL_CODES);
  const size = randomFrom(SIZES);

  const grid: (Cell | null)[][] = [
    [
      { shape: s1, fill, size, rotation: 0 },
      { shape: s2, fill, size, rotation: 0 },
      { shape: s3, fill, size, rotation: 0 },
    ],
    [
      { shape: s2, fill, size, rotation: 0 },
      { shape: s3, fill, size, rotation: 0 },
      { shape: s1, fill, size, rotation: 0 },
    ],
    [
      { shape: s3, fill, size, rotation: 0 },
      { shape: s1, fill, size, rotation: 0 },
      null,
    ],
  ];
  const answer: Cell = { shape: s2, fill, size, rotation: 0 };
  const distractors: Cell[] = [
    { shape: s1, fill, size, rotation: 0 },
    { shape: s3, fill, size, rotation: 0 },
    { shape: randomFrom(shapes.filter((s) => s !== s1 && s !== s2 && s !== s3)), fill, size, rotation: 0 },
  ];
  return { grid, answer, distractors, rule: 'Each row contains three different shapes in rotation', ruleCode: 'shape_sequence' };
}

function generateFillProgressionPuzzle(): MatrixPuzzle {
  const shape = randomFrom(SHAPE_CODES);
  const size = randomFrom(SIZES);
  const fills: FillCode[] = ['empty', 'half', 'full'];

  const grid: (Cell | null)[][] = [
    [
      { shape, fill: 'empty', size, rotation: 0 },
      { shape, fill: 'half', size, rotation: 0 },
      { shape, fill: 'full', size, rotation: 0 },
    ],
    [
      { shape, fill: 'half', size, rotation: 0 },
      { shape, fill: 'full', size, rotation: 0 },
      { shape, fill: 'empty', size, rotation: 0 },
    ],
    [
      { shape, fill: 'full', size, rotation: 0 },
      { shape, fill: 'empty', size, rotation: 0 },
      null,
    ],
  ];
  const answer: Cell = { shape, fill: 'half', size, rotation: 0 };
  const distractors: Cell[] = [
    { shape, fill: 'empty', size, rotation: 0 },
    { shape, fill: 'full', size, rotation: 0 },
    { shape, fill: 'dot', size, rotation: 0 },
  ];
  return { grid, answer, distractors, rule: 'Fill level cycles: empty → half → full', ruleCode: 'fill_progression' };
}

function generateSizeProgressionPuzzle(): MatrixPuzzle {
  const shape = randomFrom(SHAPE_CODES);
  const fill = randomFrom(FILL_CODES);

  const grid: (Cell | null)[][] = [
    [
      { shape, fill, size: 'small', rotation: 0 },
      { shape, fill, size: 'medium', rotation: 0 },
      { shape, fill, size: 'large', rotation: 0 },
    ],
    [
      { shape, fill, size: 'medium', rotation: 0 },
      { shape, fill, size: 'large', rotation: 0 },
      { shape, fill, size: 'small', rotation: 0 },
    ],
    [
      { shape, fill, size: 'large', rotation: 0 },
      { shape, fill, size: 'small', rotation: 0 },
      null,
    ],
  ];
  const answer: Cell = { shape, fill, size: 'medium', rotation: 0 };
  const distractors: Cell[] = [
    { shape, fill, size: 'small', rotation: 0 },
    { shape, fill, size: 'large', rotation: 0 },
    { shape: randomFrom(SHAPE_CODES.filter((s) => s !== shape)), fill, size: 'medium', rotation: 0 },
  ];
  return { grid, answer, distractors, rule: 'Size cycles: small → medium → large', ruleCode: 'size_progression' };
}

function generateRotationPuzzle(): MatrixPuzzle {
  const shape = randomFrom(['arrow', 'triangle', 'diamond'] as ShapeCode[]);
  const fill = randomFrom(FILL_CODES);
  const size = randomFrom(SIZES);

  const grid: (Cell | null)[][] = [
    [
      { shape, fill, size, rotation: 0 },
      { shape, fill, size, rotation: 90 },
      { shape, fill, size, rotation: 180 },
    ],
    [
      { shape, fill, size, rotation: 90 },
      { shape, fill, size, rotation: 180 },
      { shape, fill, size, rotation: 270 },
    ],
    [
      { shape, fill, size, rotation: 180 },
      { shape, fill, size, rotation: 270 },
      null,
    ],
  ];
  const answer: Cell = { shape, fill, size, rotation: 0 };
  const distractors: Cell[] = [
    { shape, fill, size, rotation: 90 },
    { shape, fill, size, rotation: 180 },
    { shape, fill, size, rotation: 270 },
  ];
  return { grid, answer, distractors, rule: 'Each row rotates the shape by 90° clockwise', ruleCode: 'rotation_sequence' };
}

function generateMixedRulePuzzle(): MatrixPuzzle {
  const puzzles = [
    generateShapeSequencePuzzle,
    generateFillProgressionPuzzle,
    generateSizeProgressionPuzzle,
    generateRotationPuzzle,
  ];
  return randomFrom(puzzles)();
}

const PUZZLE_GENERATORS = [
  generateShapeSequencePuzzle,
  generateFillProgressionPuzzle,
  generateSizeProgressionPuzzle,
  generateRotationPuzzle,
  generateMixedRulePuzzle,
];

export function generateMatrixPuzzle(difficulty: 'easy' | 'medium' | 'hard'): MatrixData {
  let puzzle: MatrixPuzzle;

  if (difficulty === 'easy') {
    puzzle = randomFrom([generateShapeSequencePuzzle, generateFillProgressionPuzzle])();
  } else if (difficulty === 'medium') {
    puzzle = randomFrom([generateSizeProgressionPuzzle, generateFillProgressionPuzzle, generateShapeSequencePuzzle])();
  } else {
    puzzle = randomFrom([generateRotationPuzzle, generateMixedRulePuzzle, generateSizeProgressionPuzzle])();
  }

  const cellSize = 80;
  const padding = 6;
  const totalSize = cellSize * 3 + padding * 4;

  function renderGrid(grid: (Cell | null)[][]): string {
    let svgContent = '';
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = padding + col * (cellSize + padding);
        const y = padding + row * (cellSize + padding);
        // cell background
        svgContent += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="10" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>`;
        const cell = grid[row][col];
        if (cell) {
          svgContent += cellToSvg(cell, x, y, cellSize);
        } else {
          // question mark for missing cell
          svgContent += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 12}" text-anchor="middle" font-size="36" fill="rgba(255,255,255,0.5)">?</text>`;
        }
      }
    }
    return svgContent;
  }

  const gridSvg = renderGrid(puzzle.grid);

  // Shuffle answer into options
  const allOptions = [...puzzle.distractors, puzzle.answer];
  const shuffled = allOptions.sort(() => Math.random() - 0.5);
  const answerIndex = shuffled.findIndex(
    (c) =>
      c.shape === puzzle.answer.shape &&
      c.fill === puzzle.answer.fill &&
      c.size === puzzle.answer.size &&
      c.rotation === puzzle.answer.rotation
  );

  function renderOption(cell: Cell): string {
    const size = 70;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${cellToSvg(cell, 0, 0, size)}</svg>`;
    return svg;
  }

  return {
    cells: puzzle.grid.map((row) => row.map((cell) => (cell ? JSON.stringify(cell) : null))),
    options: shuffled.map((cell) => renderOption(cell)),
    answerIndex,
    rule: puzzle.rule,
  };
}

export function generateMatrixSvg(matrixData: MatrixData): string {
  const cellSize = 80;
  const padding = 6;
  const totalSize = cellSize * 3 + padding * 4;

  let content = '';
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = padding + col * (cellSize + padding);
      const y = padding + row * (cellSize + padding);
      content += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="10" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>`;
      const cellJson = matrixData.cells[row][col];
      if (cellJson) {
        const cell: Cell = JSON.parse(cellJson);
        content += cellToSvg(cell, x, y, cellSize);
      } else {
        content += `<text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 12}" text-anchor="middle" font-size="36" fill="rgba(255,255,255,0.5)">?</text>`;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}">${content}</svg>`;
}

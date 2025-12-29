import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TOKEN_COLORS: Record<string, string> = {
  keyword: "#cc99cd",
  string: "#7ec699",
  comment: "#999999",
  function: "#f8c555",
  number: "#f99157",
  operator: "#67cdcc",
  punctuation: "#cccccc",
  builtin: "#f8c555",
};

// Python keywords and patterns
const PYTHON_PATTERNS = {
  keyword: /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|True|False|None)\b/g,
  builtin: /\b(print|len|range|str|int|float|list|dict|set|tuple|open|input|type|isinstance|hasattr|getattr|setattr|abs|all|any|bin|bool|bytes|callable|chr|classmethod|compile|complex|delattr|dir|divmod|enumerate|eval|exec|filter|format|frozenset|globals|hash|help|hex|id|iter|locals|map|max|memoryview|min|next|object|oct|ord|pow|property|repr|reversed|round|slice|sorted|staticmethod|sum|super|vars|zip)\b/g,
  string: /("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
  comment: /#.*/g,
  number: /\b\d+\.?\d*\b/g,
  operator: /[+\-*/%=<>!&|^~]+/g,
  punctuation: /[()[\]{},.:;]/g,
};

interface Token {
  type: string;
  content: string;
  start: number;
  end: number;
}

const escapeHTML = (str: string): string => {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

const tokenizePython = (code: string): Token[] => {
  const tokens: Token[] = [];
  const processedRanges: { start: number; end: number }[] = [];

  const isOverlapping = (start: number, end: number): boolean => {
    return processedRanges.some(range => 
      (start >= range.start && start < range.end) || 
      (end > range.start && end <= range.end) ||
      (start <= range.start && end >= range.end)
    );
  };

  // Process strings first (highest priority)
  const stringMatches = [...code.matchAll(PYTHON_PATTERNS.string)];
  for (const match of stringMatches) {
    const start = match.index!;
    const end = start + match[0].length;
    tokens.push({ type: 'string', content: match[0], start, end });
    processedRanges.push({ start, end });
  }

  // Process comments
  const commentMatches = [...code.matchAll(PYTHON_PATTERNS.comment)];
  for (const match of commentMatches) {
    const start = match.index!;
    const end = start + match[0].length;
    if (!isOverlapping(start, end)) {
      tokens.push({ type: 'comment', content: match[0], start, end });
      processedRanges.push({ start, end });
    }
  }

  // Process keywords
  const keywordMatches = [...code.matchAll(PYTHON_PATTERNS.keyword)];
  for (const match of keywordMatches) {
    const start = match.index!;
    const end = start + match[0].length;
    if (!isOverlapping(start, end)) {
      tokens.push({ type: 'keyword', content: match[0], start, end });
      processedRanges.push({ start, end });
    }
  }

  // Process builtins
  const builtinMatches = [...code.matchAll(PYTHON_PATTERNS.builtin)];
  for (const match of builtinMatches) {
    const start = match.index!;
    const end = start + match[0].length;
    if (!isOverlapping(start, end)) {
      tokens.push({ type: 'builtin', content: match[0], start, end });
      processedRanges.push({ start, end });
    }
  }

  // Process numbers
  const numberMatches = [...code.matchAll(PYTHON_PATTERNS.number)];
  for (const match of numberMatches) {
    const start = match.index!;
    const end = start + match[0].length;
    if (!isOverlapping(start, end)) {
      tokens.push({ type: 'number', content: match[0], start, end });
      processedRanges.push({ start, end });
    }
  }

  // Sort tokens by position
  tokens.sort((a, b) => a.start - b.start);

  return tokens;
};

const generateHighlightedHTML = (code: string): string => {
  const tokens = tokenizePython(code);
  let result = '';
  let lastIndex = 0;

  for (const token of tokens) {
    // Add plain text before this token
    if (token.start > lastIndex) {
      result += escapeHTML(code.slice(lastIndex, token.start));
    }
    
    // Add the token with color
    const color = TOKEN_COLORS[token.type] || "#f8f8f2";
    result += `<span style="color:${color};">${escapeHTML(token.content)}</span>`;
    lastIndex = token.end;
  }

  // Add remaining plain text
  if (lastIndex < code.length) {
    result += escapeHTML(code.slice(lastIndex));
  }

  return result;
};

const LMSTools = () => {
  const [inputCode, setInputCode] = useState('');
  const [previewHTML, setPreviewHTML] = useState('');
  const [moodleHTML, setMoodleHTML] = useState('');

  const handleConvert = () => {
    if (!inputCode.trim()) {
      toast({
        title: "Input kosong",
        description: "Silakan masukkan kode Python terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    const highlightedHTML = generateHighlightedHTML(inputCode);
    setPreviewHTML(highlightedHTML);

    const fullMoodleHTML = `<pre contenteditable="false" style="
background:#2d2d2d;
color:#f8f8f2;
font-family:Consolas,monospace;
padding:12px;
border-radius:6px;
overflow:auto;
">
${highlightedHTML}
</pre>
<p></p>`;

    setMoodleHTML(fullMoodleHTML);
    
    toast({
      title: "Konversi berhasil",
      description: "Kode Python berhasil dikonversi ke HTML Moodle.",
    });
  };

  const handleCopy = async () => {
    if (!moodleHTML) {
      toast({
        title: "Tidak ada hasil",
        description: "Silakan konversi kode terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(moodleHTML);
      toast({
        title: "Berhasil disalin",
        description: "HTML IDE-like Moodle siap ditempel.",
      });
    } catch (error) {
      toast({
        title: "Gagal menyalin",
        description: "Terjadi kesalahan saat menyalin ke clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            LMS Tools
          </h1>
          <p className="text-gray-600">
            Alat bantu untuk pengelolaan konten Learning Management System
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="code-converter" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-1">
            <TabsTrigger value="code-converter">Code Converter</TabsTrigger>
          </TabsList>

          <TabsContent value="code-converter" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                  Python → Moodle IDE Beautifier
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Mengubah kode Python menjadi HTML siap pakai dengan syntax highlighting untuk LMS Moodle
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Masukkan Kode Python
                  </label>
                  <Textarea
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="# Masukkan kode Python di sini...&#10;def hello_world():&#10;    print('Hello, World!')"
                    className="min-h-[200px] font-mono text-sm bg-gray-900 text-gray-100 border-gray-700"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button onClick={handleConvert} className="bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Convert
                  </Button>
                  <Button onClick={handleCopy} variant="outline" disabled={!moodleHTML}>
                    <Copy className="w-4 h-4 mr-2" />
                    Salin HTML Moodle
                  </Button>
                </div>

                {/* Preview Section */}
                {previewHTML && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Preview Hasil
                    </label>
                    <pre 
                      className="p-4 rounded-lg overflow-auto text-sm"
                      style={{
                        background: '#2d2d2d',
                        color: '#f8f8f2',
                        fontFamily: 'Consolas, monospace',
                      }}
                      dangerouslySetInnerHTML={{ __html: previewHTML }}
                    />
                  </div>
                )}

                {/* Raw HTML Output */}
                {moodleHTML && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      HTML Output (untuk disalin ke Moodle)
                    </label>
                    <Textarea
                      value={moodleHTML}
                      readOnly
                      className="min-h-[150px] font-mono text-xs bg-gray-100"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default LMSTools;

import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type Language = 'auto' | 'python' | 'javascript' | 'java';

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

// JavaScript keywords and patterns
const JAVASCRIPT_PATTERNS = {
  keyword: /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|function|if|import|in|instanceof|let|new|of|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|true|false|null|undefined)\b/g,
  builtin: /\b(console|window|document|Array|Object|String|Number|Boolean|Function|Symbol|Map|Set|WeakMap|WeakSet|Promise|Proxy|Reflect|JSON|Math|Date|RegExp|Error|parseInt|parseFloat|isNaN|isFinite|decodeURI|encodeURI|setTimeout|setInterval|fetch|alert|confirm)\b/g,
  string: /(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
  comment: /(\/\/.*|\/\*[\s\S]*?\*\/)/g,
  number: /\b\d+\.?\d*\b/g,
  operator: /[+\-*/%=<>!&|^~?:]+/g,
  punctuation: /[()[\]{},.:;]/g,
};

// Java keywords and patterns
const JAVA_PATTERNS = {
  keyword: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|true|false|null)\b/g,
  builtin: /\b(System|String|Integer|Double|Float|Boolean|Character|Object|Class|Exception|RuntimeException|Thread|Runnable|ArrayList|HashMap|HashSet|LinkedList|Collections|Arrays|Math|Scanner|PrintStream|InputStream|OutputStream|File|IOException)\b/g,
  string: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
  comment: /(\/\/.*|\/\*[\s\S]*?\*\/)/g,
  number: /\b\d+\.?\d*[dDfFlL]?\b/g,
  operator: /[+\-*/%=<>!&|^~?:]+/g,
  punctuation: /[()[\]{},.:;@]/g,
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

const detectLanguage = (code: string): Language => {
  const pythonIndicators = [
    /\bdef\s+\w+\s*\(/,
    /\bimport\s+\w+/,
    /\bfrom\s+\w+\s+import/,
    /:\s*$/m,
    /\bprint\s*\(/,
    /\belif\b/,
    /#.*$/m,
  ];

  const javascriptIndicators = [
    /\bfunction\s+\w+\s*\(/,
    /\bconst\s+\w+\s*=/,
    /\blet\s+\w+\s*=/,
    /\bvar\s+\w+\s*=/,
    /=>\s*[{(]/,
    /\bconsole\.\w+/,
    /\bdocument\.\w+/,
    /\bwindow\.\w+/,
  ];

  const javaIndicators = [
    /\bpublic\s+(static\s+)?(void|class|int|String)/,
    /\bprivate\s+(static\s+)?(void|class|int|String)/,
    /\bSystem\.out\./,
    /\bpublic\s+static\s+void\s+main/,
    /\bimport\s+java\./,
    /\bpackage\s+\w+/,
    /;\s*$/m,
  ];

  let pythonScore = 0;
  let jsScore = 0;
  let javaScore = 0;

  pythonIndicators.forEach(pattern => {
    if (pattern.test(code)) pythonScore++;
  });

  javascriptIndicators.forEach(pattern => {
    if (pattern.test(code)) jsScore++;
  });

  javaIndicators.forEach(pattern => {
    if (pattern.test(code)) javaScore++;
  });

  if (javaScore >= jsScore && javaScore >= pythonScore && javaScore > 0) {
    return 'java';
  }
  if (jsScore >= pythonScore && jsScore > 0) {
    return 'javascript';
  }
  if (pythonScore > 0) {
    return 'python';
  }

  return 'python'; // Default to Python
};

const tokenize = (code: string, language: Language): Token[] => {
  const patterns = language === 'python' ? PYTHON_PATTERNS
    : language === 'javascript' ? JAVASCRIPT_PATTERNS
      : JAVA_PATTERNS;

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
  const stringMatches = [...code.matchAll(patterns.string)];
  for (const match of stringMatches) {
    const start = match.index!;
    const end = start + match[0].length;
    tokens.push({ type: 'string', content: match[0], start, end });
    processedRanges.push({ start, end });
  }

  // Process comments
  const commentMatches = [...code.matchAll(patterns.comment)];
  for (const match of commentMatches) {
    const start = match.index!;
    const end = start + match[0].length;
    if (!isOverlapping(start, end)) {
      tokens.push({ type: 'comment', content: match[0], start, end });
      processedRanges.push({ start, end });
    }
  }

  // Process keywords
  const keywordMatches = [...code.matchAll(patterns.keyword)];
  for (const match of keywordMatches) {
    const start = match.index!;
    const end = start + match[0].length;
    if (!isOverlapping(start, end)) {
      tokens.push({ type: 'keyword', content: match[0], start, end });
      processedRanges.push({ start, end });
    }
  }

  // Process builtins
  const builtinMatches = [...code.matchAll(patterns.builtin)];
  for (const match of builtinMatches) {
    const start = match.index!;
    const end = start + match[0].length;
    if (!isOverlapping(start, end)) {
      tokens.push({ type: 'builtin', content: match[0], start, end });
      processedRanges.push({ start, end });
    }
  }

  // Process numbers
  const numberMatches = [...code.matchAll(patterns.number)];
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

const generateHighlightedHTML = (code: string, language: Language): string => {
  const effectiveLanguage = language === 'auto' ? detectLanguage(code) : language;
  const tokens = tokenize(code, effectiveLanguage);
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

const getLanguageLabel = (lang: Language): string => {
  switch (lang) {
    case 'auto': return 'Auto Detect';
    case 'python': return 'Python';
    case 'javascript': return 'JavaScript';
    case 'java': return 'Java';
    default: return lang;
  }
};

const LMSTools = () => {
  const [inputCode, setInputCode] = useState('');
  const [previewHTML, setPreviewHTML] = useState('');
  const [moodleHTML, setMoodleHTML] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('auto');
  const [detectedLanguage, setDetectedLanguage] = useState<Language | null>(null);

  const handleConvert = () => {
    if (!inputCode.trim()) {
      toast({
        title: "Input kosong",
        description: "Silakan masukkan kode terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    const effectiveLang = selectedLanguage === 'auto' ? detectLanguage(inputCode) : selectedLanguage;
    if (selectedLanguage === 'auto') {
      setDetectedLanguage(effectiveLang);
    } else {
      setDetectedLanguage(null);
    }

    const highlightedHTML = generateHighlightedHTML(inputCode, selectedLanguage);
    setPreviewHTML(highlightedHTML);

    // Escape code for HTML attribute (double quotes and special chars)
    const escapedCodeForAttr = inputCode
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const fullMoodleHTML = `<div>
<pre contenteditable="false" style="background:#2d2d2d;color:#f8f8f2;font-family:Consolas,monospace;padding:12px;border-radius:6px 6px 0 0;overflow:auto;margin:0;">
${highlightedHTML}
</pre>
<button onclick="var code=this.getAttribute('data-code');var t=document.createElement('textarea');t.value=code;document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);this.innerText='✓ Disalin!';var b=this;setTimeout(function(){b.innerText='📋 Salin';},2000);" data-code="${escapedCodeForAttr}" style="background:#4a4a4a;color:#fff;border:none;padding:10px 16px;border-radius:0 0 6px 6px;cursor:pointer;font-size:12px;width:10%;text-align:center;">📋 Salin</button>
</div>
<p></p>`;

    setMoodleHTML(fullMoodleHTML);

    toast({
      title: "Konversi berhasil",
      description: `Kode ${getLanguageLabel(effectiveLang)} berhasil dikonversi ke HTML Moodle.`,
    });
  };

  const handleCopyCode = async () => {
    if (!inputCode.trim()) {
      toast({
        title: "Tidak ada kode",
        description: "Silakan masukkan kode terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(inputCode);
      toast({
        title: "Berhasil disalin",
        description: "Kode sumber berhasil disalin ke clipboard.",
      });
    } catch (error) {
      toast({
        title: "Gagal menyalin",
        description: "Terjadi kesalahan saat menyalin ke clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleCopyMoodleHTML = async () => {
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
        description: "HTML Moodle (termasuk tombol Copy) siap ditempel.",
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
                  Code → Moodle IDE Beautifier
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Mengubah kode pemrograman menjadi HTML siap pakai dengan syntax highlighting untuk LMS Moodle
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Bahasa Pemrograman
                  </label>
                  <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
                    <SelectTrigger className="w-full max-w-xs bg-background">
                      <SelectValue placeholder="Pilih bahasa" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="auto">🔍 Auto Detect</SelectItem>
                      <SelectItem value="python">🐍 Python</SelectItem>
                      <SelectItem value="javascript">📜 JavaScript</SelectItem>
                      <SelectItem value="java">☕ Java</SelectItem>
                    </SelectContent>
                  </Select>
                  {detectedLanguage && (
                    <p className="text-xs text-blue-600">
                      Terdeteksi sebagai: {getLanguageLabel(detectedLanguage)}
                    </p>
                  )}
                </div>

                {/* Input Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Masukkan Kode {selectedLanguage !== 'auto' ? getLanguageLabel(selectedLanguage) : ''}
                  </label>
                  <Textarea
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="// Masukkan kode di sini..."
                    className="min-h-[200px] font-mono text-sm bg-gray-900 text-gray-100 border-gray-700"
                  />
                </div>

                {/* Convert Button */}
                <div className="flex gap-3 flex-wrap">
                  <Button onClick={handleConvert} className="bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Convert
                  </Button>
                </div>

                {/* Preview Section with Copy Button */}
                {previewHTML && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Preview Hasil
                    </label>
                    <div className="relative">
                      <pre
                        className="p-4 pt-12 rounded-lg overflow-auto text-sm"
                        style={{
                          background: '#2d2d2d',
                          color: '#f8f8f2',
                          fontFamily: 'Consolas, monospace',
                        }}
                        dangerouslySetInnerHTML={{ __html: previewHTML }}
                      />
                      <Button
                        onClick={handleCopyCode}
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2 bg-gray-600 hover:bg-gray-500 text-white text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Kode
                      </Button>
                    </div>
                  </div>
                )}

                {/* Salin HTML Moodle Button */}
                {moodleHTML && (
                  <div className="flex gap-3">
                    <Button onClick={handleCopyMoodleHTML} variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Salin HTML Moodle
                    </Button>
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

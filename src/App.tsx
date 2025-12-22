import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Tool pages - Conversion
import TimestampTool from "./pages/tools/TimestampTool";
import RadixTool from "./pages/tools/RadixTool";
import UrlCodecTool from "./pages/tools/UrlCodecTool";
import JsonConverterTool from "./pages/tools/JsonConverterTool";

// Tool pages - Formatting
import JsonFormatterTool from "./pages/tools/JsonFormatterTool";
import SqlFormatterTool from "./pages/tools/SqlFormatterTool";
import HtmlFormatterTool from "./pages/tools/HtmlFormatterTool";

// Tool pages - Generation
import UuidTool from "./pages/tools/UuidTool";
import RandomStringTool from "./pages/tools/RandomStringTool";
import ColorPickerTool from "./pages/tools/ColorPickerTool";
import CronTool from "./pages/tools/CronTool";

// Tool pages - Encryption
import Base64Tool from "./pages/tools/Base64Tool";
import Md5Tool from "./pages/tools/Md5Tool";
import ShaTool from "./pages/tools/ShaTool";

// Tool pages - Text
import CaseConverterTool from "./pages/tools/CaseConverterTool";
import TextDiffTool from "./pages/tools/TextDiffTool";
import RegexTesterTool from "./pages/tools/RegexTesterTool";
import TextStatsTool from "./pages/tools/TextStatsTool";
import MarkdownTool from "./pages/tools/MarkdownTool";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Conversion Tools */}
          <Route path="/tools/timestamp" element={<TimestampTool />} />
          <Route path="/tools/radix" element={<RadixTool />} />
          <Route path="/tools/url-codec" element={<UrlCodecTool />} />
          <Route path="/tools/json-converter" element={<JsonConverterTool />} />
          
          {/* Formatting Tools */}
          <Route path="/tools/json-formatter" element={<JsonFormatterTool />} />
          <Route path="/tools/sql-formatter" element={<SqlFormatterTool />} />
          <Route path="/tools/html-formatter" element={<HtmlFormatterTool />} />
          
          {/* Generation Tools */}
          <Route path="/tools/uuid" element={<UuidTool />} />
          <Route path="/tools/random-string" element={<RandomStringTool />} />
          <Route path="/tools/color-picker" element={<ColorPickerTool />} />
          <Route path="/tools/cron" element={<CronTool />} />
          
          {/* Encryption Tools */}
          <Route path="/tools/base64" element={<Base64Tool />} />
          <Route path="/tools/md5" element={<Md5Tool />} />
          <Route path="/tools/sha" element={<ShaTool />} />
          
          {/* Text Tools */}
          <Route path="/tools/case-converter" element={<CaseConverterTool />} />
          <Route path="/tools/text-diff" element={<TextDiffTool />} />
          <Route path="/tools/regex-tester" element={<RegexTesterTool />} />
          <Route path="/tools/text-stats" element={<TextStatsTool />} />
          <Route path="/tools/markdown" element={<MarkdownTool />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

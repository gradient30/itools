import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";

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
import GradientTool from "./pages/tools/GradientTool";

// Tool pages - Encryption
import AesTool from "./pages/tools/AesTool";
import Base64Tool from "./pages/tools/Base64Tool";
import Md5Tool from "./pages/tools/Md5Tool";
import ShaTool from "./pages/tools/ShaTool";

// Tool pages - Text
import CaseConverterTool from "./pages/tools/CaseConverterTool";
import TextDiffTool from "./pages/tools/TextDiffTool";
import RegexTesterTool from "./pages/tools/RegexTesterTool";
import TextStatsTool from "./pages/tools/TextStatsTool";
import MarkdownTool from "./pages/tools/MarkdownTool";

// Additional Tools
import JsonDiffTool from "./pages/tools/JsonDiffTool";
import CssFormatterTool from "./pages/tools/CssFormatterTool";
import QrCodeTool from "./pages/tools/QrCodeTool";
import PasswordGeneratorTool from "./pages/tools/PasswordGeneratorTool";
import ImageCompressTool from "./pages/tools/ImageCompressTool";
import Base64ImageTool from "./pages/tools/Base64ImageTool";
import JwtTool from "./pages/tools/JwtTool";

// Documentation Reference
import GitReference from "./pages/docs/GitReference";
import HttpStatusReference from "./pages/docs/HttpStatusReference";
import RegexReference from "./pages/docs/RegexReference";
import MarkdownReference from "./pages/docs/MarkdownReference";
import SqlReference from "./pages/docs/SqlReference";
import LinuxReference from "./pages/docs/LinuxReference";
import CurlReference from "./pages/docs/CurlReference";
import AsciiReference from "./pages/docs/AsciiReference";
import ColorsReference from "./pages/docs/ColorsReference";
import PortsReference from "./pages/docs/PortsReference";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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
            <Route path="/tools/aes" element={<AesTool />} />
            <Route path="/tools/base64" element={<Base64Tool />} />
            <Route path="/tools/md5" element={<Md5Tool />} />
            <Route path="/tools/sha" element={<ShaTool />} />
            
            {/* Text Tools */}
            <Route path="/tools/case-converter" element={<CaseConverterTool />} />
            <Route path="/tools/text-diff" element={<TextDiffTool />} />
            <Route path="/tools/regex-tester" element={<RegexTesterTool />} />
            <Route path="/tools/text-stats" element={<TextStatsTool />} />
            <Route path="/tools/markdown" element={<MarkdownTool />} />
            
            {/* Additional Tools */}
            <Route path="/tools/json-diff" element={<JsonDiffTool />} />
            <Route path="/tools/css-formatter" element={<CssFormatterTool />} />
            <Route path="/tools/qrcode" element={<QrCodeTool />} />
            <Route path="/tools/password-generator" element={<PasswordGeneratorTool />} />
            <Route path="/tools/image-compress" element={<ImageCompressTool />} />
            <Route path="/tools/base64-image" element={<Base64ImageTool />} />
            <Route path="/tools/jwt" element={<JwtTool />} />
            <Route path="/tools/gradient" element={<GradientTool />} />
            
            {/* About Page */}
            <Route path="/about" element={<About />} />
            
            {/* Documentation Reference */}
            <Route path="/docs/git" element={<GitReference />} />
            <Route path="/docs/http-status" element={<HttpStatusReference />} />
            <Route path="/docs/regex" element={<RegexReference />} />
            <Route path="/docs/markdown" element={<MarkdownReference />} />
            <Route path="/docs/sql" element={<SqlReference />} />
            <Route path="/docs/linux" element={<LinuxReference />} />
            <Route path="/docs/curl" element={<CurlReference />} />
            <Route path="/docs/ascii" element={<AsciiReference />} />
            <Route path="/docs/colors" element={<ColorsReference />} />
            <Route path="/docs/ports" element={<PortsReference />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

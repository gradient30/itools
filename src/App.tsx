import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import PageLoader from "./components/PageLoader";

// Tool pages - Conversion
const TimestampTool = lazy(() => import("./pages/tools/TimestampTool"));
const RadixTool = lazy(() => import("./pages/tools/RadixTool"));
const UrlCodecTool = lazy(() => import("./pages/tools/UrlCodecTool"));
const JsonConverterTool = lazy(() => import("./pages/tools/JsonConverterTool"));

// Tool pages - Formatting
const JsonFormatterTool = lazy(() => import("./pages/tools/JsonFormatterTool"));
const SqlFormatterTool = lazy(() => import("./pages/tools/SqlFormatterTool"));
const HtmlFormatterTool = lazy(() => import("./pages/tools/HtmlFormatterTool"));

// Tool pages - Generation
const UuidTool = lazy(() => import("./pages/tools/UuidTool"));
const RandomStringTool = lazy(() => import("./pages/tools/RandomStringTool"));
const ColorPickerTool = lazy(() => import("./pages/tools/ColorPickerTool"));
const CronTool = lazy(() => import("./pages/tools/CronTool"));
const GradientTool = lazy(() => import("./pages/tools/GradientTool"));

// Tool pages - Encryption
const AesTool = lazy(() => import("./pages/tools/AesTool"));
const Base64Tool = lazy(() => import("./pages/tools/Base64Tool"));
const Md5Tool = lazy(() => import("./pages/tools/Md5Tool"));
const ShaTool = lazy(() => import("./pages/tools/ShaTool"));

// Tool pages - Text
const CaseConverterTool = lazy(() => import("./pages/tools/CaseConverterTool"));
const TextDiffTool = lazy(() => import("./pages/tools/TextDiffTool"));
const RegexTesterTool = lazy(() => import("./pages/tools/RegexTesterTool"));
const TextStatsTool = lazy(() => import("./pages/tools/TextStatsTool"));
const MarkdownTool = lazy(() => import("./pages/tools/MarkdownTool"));

// Additional Tools
const JsonDiffTool = lazy(() => import("./pages/tools/JsonDiffTool"));
const CssFormatterTool = lazy(() => import("./pages/tools/CssFormatterTool"));
const QrCodeTool = lazy(() => import("./pages/tools/QrCodeTool"));
const PasswordGeneratorTool = lazy(() => import("./pages/tools/PasswordGeneratorTool"));
const ImageCompressTool = lazy(() => import("./pages/tools/ImageCompressTool"));
const Base64ImageTool = lazy(() => import("./pages/tools/Base64ImageTool"));
const JwtTool = lazy(() => import("./pages/tools/JwtTool"));

// Documentation Reference
const GitReference = lazy(() => import("./pages/docs/GitReference"));
const HttpStatusReference = lazy(() => import("./pages/docs/HttpStatusReference"));
const RegexReference = lazy(() => import("./pages/docs/RegexReference"));
const MarkdownReference = lazy(() => import("./pages/docs/MarkdownReference"));
const SqlReference = lazy(() => import("./pages/docs/SqlReference"));
const LinuxReference = lazy(() => import("./pages/docs/LinuxReference"));
const CurlReference = lazy(() => import("./pages/docs/CurlReference"));
const AsciiReference = lazy(() => import("./pages/docs/AsciiReference"));
const ColorsReference = lazy(() => import("./pages/docs/ColorsReference"));
const PortsReference = lazy(() => import("./pages/docs/PortsReference"));
const SecurityTestingReference = lazy(() => import("./pages/docs/SecurityTestingReference"));
const GameTestingReference = lazy(() => import("./pages/docs/GameTestingReference"));
const SoftwareTestingReference = lazy(() => import("./pages/docs/SoftwareTestingReference"));
const GameRnDLifecycleReference = lazy(() => import("./pages/docs/GameRnDLifecycleReference"));
const VersionTestingManagementReference = lazy(() => import("./pages/docs/VersionTestingManagementReference"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/docs/security-testing" element={<SecurityTestingReference />} />
              <Route path="/docs/game-testing" element={<GameTestingReference />} />
              <Route path="/docs/software-testing" element={<SoftwareTestingReference />} />
              <Route path="/docs/game-rnd-lifecycle" element={<GameRnDLifecycleReference />} />
              <Route path="/docs/version-testing-management" element={<VersionTestingManagementReference />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

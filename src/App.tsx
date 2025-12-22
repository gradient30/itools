import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Tool pages
import TimestampTool from "./pages/tools/TimestampTool";
import RadixTool from "./pages/tools/RadixTool";
import UrlCodecTool from "./pages/tools/UrlCodecTool";
import JsonFormatterTool from "./pages/tools/JsonFormatterTool";
import SqlFormatterTool from "./pages/tools/SqlFormatterTool";
import HtmlFormatterTool from "./pages/tools/HtmlFormatterTool";
import UuidTool from "./pages/tools/UuidTool";
import RandomStringTool from "./pages/tools/RandomStringTool";
import Base64Tool from "./pages/tools/Base64Tool";
import Md5Tool from "./pages/tools/Md5Tool";

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
          
          {/* Formatting Tools */}
          <Route path="/tools/json-formatter" element={<JsonFormatterTool />} />
          <Route path="/tools/sql-formatter" element={<SqlFormatterTool />} />
          <Route path="/tools/html-formatter" element={<HtmlFormatterTool />} />
          
          {/* Generation Tools */}
          <Route path="/tools/uuid" element={<UuidTool />} />
          <Route path="/tools/random-string" element={<RandomStringTool />} />
          
          {/* Encryption Tools */}
          <Route path="/tools/base64" element={<Base64Tool />} />
          <Route path="/tools/md5" element={<Md5Tool />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

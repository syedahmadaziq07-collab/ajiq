import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setBaseUrl } from "@workspace/api-client-react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Wallpapers from "@/pages/wallpapers";
import WallpaperPost from "@/pages/wallpaper-post";
import Templates from "@/pages/templates";
import TemplatePost from "@/pages/template-post";
import Guides from "@/pages/guides";
import GuidePost from "@/pages/guide-post";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Contact from "@/pages/contact";
import Success from "@/pages/success";
import Admin from "@/pages/admin";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const API_URL = import.meta.env.VITE_API_URL ?? "";
if (API_URL) setBaseUrl(API_URL);

const queryClient = new QueryClient();

function Router() {
  return (
    <ErrorBoundary>
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/wallpapers" component={Wallpapers} />
          <Route path="/wallpapers/:slug" component={WallpaperPost} />
          <Route path="/templates" component={Templates} />
          <Route path="/templates/:slug" component={TemplatePost} />
          <Route path="/guides" component={Guides} />
          <Route path="/guides/:slug" component={GuidePost} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/success" component={Success} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

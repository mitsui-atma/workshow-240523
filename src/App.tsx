import "./App.css";

import { Toaster } from "./components/ui/toaster";
import { PostalCodeForm } from "./components/pages/PostalCodeForm";

function App() {
  return (
    <>
      <PostalCodeForm />
      <Toaster />
    </>
  );
}

export default App;

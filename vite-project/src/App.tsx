import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
function App() {
  return (
    <div className="flex flex-col justify-center items-center min-h-svh">
      <Button className="bg-blue-500 text-blue">Click me</Button>
      <Input className="text-yellow-500 bg-gray-500" placeholder="Enter your name" />
    </div>
  )
}

export default App

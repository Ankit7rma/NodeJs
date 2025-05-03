import FileList from "../components/FileList";
import FileUpload from "../components/FileUploads";

 
function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>File Upload & Download Service</h1>
      <FileUpload />
  
      <FileList />
    </div>
  );
}

export default App;

import { useState } from 'react';
import './App.css'
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './components/ui/form';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

type AnalyzeResponse = {
  status: string;
  message: string;
  id: string;
  thumbnailPath: string;
  analyzeResult: {
    score: number;
    sentence_scores: { score: number; sentence: string }[];
  };
};


function App() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const formSchema = z.object({
    youtubeUrl: z.url("Invalid YouTube URL"),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeUrl: '',
    }
  })

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${apiUrl}/api/analyze`, {
        url: data.youtubeUrl,
      });
      setResult(response.data as AnalyzeResponse);
    } catch (err) {
      setError("Caused by: " + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="youtubeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Youtube URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://youtube/..." {...field} />
                </FormControl>
                <FormDescription>
                  This is the URL of the YouTube video you want to analyze.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="outline" type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </form>
      </FormProvider>

      {error && 
      <div className="grid w-full max-w-xl items-start gap-4 mt-4">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle className='text-left'>Failed to analyze the video.</AlertTitle>
          <AlertDescription>
            <p>{error}</p>
          </AlertDescription>
        </Alert>
      </div>
      }

      {result && (
        <div style={{ marginTop: 32, textAlign: 'left', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 className="text-center scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Analysis Result</h2>
          <div style={{ margin: '16px 0' }}>
            <img
              src={result.thumbnailPath.replace('localhost', window.location.hostname)}
              alt="Thumbnail"
              style={{ maxWidth: 320, borderRadius: 8 }}
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          </div>
          <div><b>Overall AI Probability:</b> {result.analyzeResult.score.toFixed(9)}</div>
          <div style={{ margin: '16px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'center', padding: 4 }}>AI Probability</th>
                  <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 4 }}>Sentence</th>
                </tr>
              </thead>
              <tbody>
                {result.analyzeResult.sentence_scores.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: 4, color: item.score > 0.8 ? 'green' : item.score < 0.2 ? 'red' : 'black', textAlign: 'center' }}>
                      {item.score.toFixed(5)}
                    </td>
                    <td style={{ padding: 4 }}>{item.sentence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App

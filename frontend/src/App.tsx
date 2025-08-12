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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/analyze`, {
        url: data.youtubeUrl,
      });

      console.log("Response data", response.data);
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
    </div>
  );
}

export default App

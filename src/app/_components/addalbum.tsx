"use client";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../components/ui/hover-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { toast } from "sonner"

export async function createUserAlbum(name: string, publicDisplay: boolean) {
    const response = await fetch('/api/addAlbum', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, publicDisplay }),
    });

    const data = await response.json();
    return data.success;
}

const formSchema = z.object({
    Album: z.string().min(2).max(50),
    public: z.boolean(),
});
function LoadingSpinner(){
    return(
       <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white">
        <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z" className="spinner_aj0A"/>
      </svg>
    );
  }
export function AddAlbum() {
    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Album: "",
            public: false,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast(
            <div className="flex items-center text-black"><LoadingSpinner></LoadingSpinner> <span className="text-lg">Creating Album...</span></div>,{
              duration: 100000,
              id: "upload-begin"
            });

        const res = await createUserAlbum(values.Album, values.public);

        if (res) {
            toast(
                <div className="flex items-center text-black"><span className="text-lg">Album created</span></div>,{
                  duration: 100000,
                  id: "upload-begin"
                });
        } else {
            toast(
                <div className="flex items-center text-black"><span className="text-lg">Failed to create album</span></div>,{
                  duration: 100000,
                  id: "upload-begin"
                });
        }
    }
    
    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    <HoverCard>
                        <HoverCardTrigger>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                                />
                            </svg>
                        </HoverCardTrigger>
                        <HoverCardContent>Add Album</HoverCardContent>
                    </HoverCard>
                </PopoverTrigger>
                <PopoverContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="Album"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Create Album</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Flowers" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is the name of the album you want to create.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="public"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Public</FormLabel>
                                        <FormControl>
                                            <div>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Set if the album can be displayed on the front page to the public.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </PopoverContent>
            </Popover>
        </div>
    );
}

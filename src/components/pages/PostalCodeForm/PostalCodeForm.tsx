import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { PostalCodeService } from "@/app/postalcode";
import { useState } from "react";

const FormSchema = z.object({
  postalCode: z
    .string()
    .transform((val) => val.replace("-", ""))
    .refine((val) => val.length === 7, {
      message: "郵便番号は7桁です。",
    })
    .refine(
      async (val) => {
        const addr = await PostalCodeService.getAddr(val);
        return addr.region_id !== 0;
      },
      { message: "存在しない郵便番号です。" }
    ),
});

export function PostalCodeForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      postalCode: "",
    },
  });

  const [addrText, setAddrText] = useState("");

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 text-left">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PostalCode</FormLabel>
              <FormControl>
                <Input
                  placeholder="shadcn"
                  {...field}
                  onChange={(ev) => {
                    const value = ev.currentTarget.value;
                    PostalCodeService.getAddr(value).then((addr) => {
                      console.log(value, addr);
                      setAddrText(JSON.stringify(addr, null, 2));
                    });

                    field.onChange(ev);
                  }}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is your public display name.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <div>
          <p>{addrText}</p>
        </div>
      </form>
    </Form>
  );
}

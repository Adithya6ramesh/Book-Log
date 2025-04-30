import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { createNotesSchema } from "@repo/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNoteMutationOptions,
  notesQueryOptions,
} from "../queries/notes.queries";

export const CreateNote = () => {
  const form = useForm({
    schema: createNotesSchema,
  });
  const queryClient = useQueryClient();

  const createNoteMutation = useMutation({
    ...createNoteMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryOptions().queryKey });
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex items-start w-full max-w-lg gap-2"
        onSubmit={form.handleSubmit((data) => createNoteMutation.mutate(data))}
      >
        <FormField
          control={form.control}
          name="title"
          render={(field) => (
            <FormItem className="w-full">
              <FormLabel />
              <FormControl>
                <Input type="text" placeholder="Title" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Note</Button>
      </form>
    </Form>
  );
};

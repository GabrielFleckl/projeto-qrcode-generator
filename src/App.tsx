import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import clsx from "clsx";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    ssid: z.string().min(2, "No mínimo 2 caracteres"),
    password: z.string(),
    encryption: z.enum(["WPA2", "WEP", "nopass"]).default("WPA2"),
    image: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.encryption !== "nopass" && data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No mínimo 8 caracteres",
        path: ["password"],
      });
    }
  });

function App() {
  const [qrcode, setQrcode] = useState("");
  const [fileURI, setFileURI] = useState("");
  const [fgColor, setFgColor] = useState("#16a349");
  const [hidden, setHidden] = useState<boolean>(false);
  const [hiddenBackBtn, setHiddenBackBtn] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ssid: "",
      password: "",
      encryption: "WPA2",
      image: "",
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFileURI(fileURL);
    }
  };
  const handlePrint = () => {
    setHidden(true);

    setTimeout(() => {
      window.print();
    }, 300);

    setTimeout(() => {
      setHiddenBackBtn(true);
    }, 2000);
  };

  const handleBackBtn = () => {
    setHiddenBackBtn(false);
    setHidden(false);
  };

  const handleForegroundChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFgColor(event.target.value);
  };
  function onSubmit(values: z.infer<typeof formSchema>) {
    const qrcode = `WIFI:T:${values.encryption};S:${values.ssid};P:${values.password};H:;`;

    setFileURI(fileURI);

    setQrcode(qrcode);
  }
  return (
    <main className="m-auto flex flex-col items-center justify-center md:h-screen md:gap-0 md:overflow-hidden">
      <p
        style={{ color: fgColor }}
        className={clsx(
          `text-center text-3xl font-bold uppercase text-primary`,
          hidden ? "mb-8 flex flex-col-reverse items-center gap-1" : "hidden"
        )}
      >
        APONTE SEU CELULAR NO QR CODE <br /> PARA SE CONECTAR NO WIFI{" "}
      </p>
      <div className="flex max-w-5xl flex-col items-end justify-between gap-10 md:flex-row md:gap-0">
        {/* Form */}
        <div
          className={clsx(
            `flex flex-col gap-2 md:gap-9`,
            hidden ? "hidden" : ""
          )}
        >
          <h2
            style={{ color: fgColor }}
            className="text-start text-3xl font-bold text-primary"
          >
            Configurações
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-2"
            >
              <div className="flex w-full flex-col justify-center md:grid md:grid-cols-2 md:gap-2">
                <FormField
                  control={form.control}
                  name="ssid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da rede (SSID)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Nomedowifi123" {...field} />
                      </FormControl>
                      <FormDescription>Mínimo de 2 caracteres</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.watch("encryption") === "nopass"}
                          placeholder="Ex: 99823212"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Mínimo de 8 caracteres</FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="encryption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Criptografia</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="WPA2" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WPA2">WPA/WPA2</SelectItem>
                            <SelectItem value="WEP">WEP</SelectItem>
                            <SelectItem value="nopass">
                              Rede aberta (Sem senha)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Padrão: WPA/WPA2</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Logo</FormLabel>
                      <FormControl>
                        <Input type="file" onChange={handleFileChange} />
                      </FormControl>
                      <FormDescription>Tamanho: 120x120</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormLabel>Cor do QR</FormLabel>
                      <FormControl>
                        <Input type="color" onChange={handleForegroundChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                style={{ backgroundColor: fgColor }}
                className="m-auto mt-4 w-full"
                type="submit"
              >
                Criar QR
              </Button>
            </form>
          </Form>
        </div>

        {/* QR CODE */}
        <div className="flex flex-col items-center justify-center gap-5">
          <QRCodeCanvas
            value={qrcode}
            size={328}
            level="H"
            fgColor={fgColor === "" ? "#16a349" : fgColor}
            imageSettings={{
              src: fileURI,
              width: 120,
              height: 120,
              opacity: fileURI != "" ? 1 : 0,
              excavate: false,
            }}
          />
          <Button
            className={clsx("w-full", hidden ? "hidden" : "")}
            onClick={handlePrint}
            style={{ backgroundColor: fgColor }}
          >
            Imprimir QR Code
          </Button>
        </div>
      </div>

      <Button
        style={{ backgroundColor: fgColor }}
        className={clsx(
          `absolute left-5 top-5 hidden transform opacity-0 transition-opacity duration-500 ease-in-out`,
          hiddenBackBtn ? "opacity-100 md:block" : ""
        )}
        onClick={handleBackBtn}
      >
        Voltar
      </Button>
    </main>
  );
}

export default App;

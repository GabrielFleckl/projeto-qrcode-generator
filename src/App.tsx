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

// import logo from "./assets/logo.png";

import { LucideWifi } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Logo from "./components/Logo";

const formSchema = z.object({
  ssid: z.string().min(2, "No mínimo 2 caracteres"),
  password: z.string().min(8, "No mínimo 8 caracteres"),
  encryption: z.string().optional(),
  image: z.string(),
});

function App() {
  const [qrcode, setQrcode] = useState("");
  const [fileURI, setFileURI] = useState("");
  const [fgColor, setFgColor] = useState("");
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
    }, 2000);

    setTimeout(() => {
      setHiddenBackBtn(true);
    }, 4000);
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
    <main className="flex flex-col items-center justify-center gap-10 py-10 md:h-screen md:overflow-hidden">
      <div className="flex w-[350px] items-center justify-center">
        <Logo fgColor={fgColor} />
      </div>

      <p
        style={{ color: fgColor }}
        className={clsx(
          `mb-5 text-center text-3xl font-bold uppercase text-primary`,
          hidden ? "flex items-center gap-2" : "hidden",
        )}
      >
        APONTE PARA O QR CODE E SE CONECTAR NO WIFI{" "}
        <LucideWifi style={{ color: fgColor }} className="size-[45px]" />
      </p>
      <div className="flex flex-col items-center justify-evenly gap-20 md:w-1/2 md:flex-row">
        {/* Form */}
        <div
          className={clsx(`flex w-full flex-col gap-3`, hidden ? "hidden" : "")}
        >
          <h2
            style={{ color: fgColor }}
            className="text-center text-2xl font-bold text-primary"
          >
            Configurações
          </h2>
          <p className="text-center text-lg font-medium text-foreground/90">
            Configure seu QR CODE aqui!
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center gap-3 overflow-auto p-2 md:h-[340px]"
            >
              <div className="flex w-full flex-col justify-center gap-3">
                <FormField
                  control={form.control}
                  name="ssid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da rede</FormLabel>
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
                        <Input placeholder="Ex: 99823212" {...field} />
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
                className="m-auto w-full"
                type="submit"
              >
                Criar QR
              </Button>
            </form>
          </Form>
        </div>
        {/* QR CODE */}
        <div className="flex h-full flex-col items-center justify-center gap-5">
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
            className={clsx(hidden ? "hidden" : "")}
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
          hiddenBackBtn ? "opacity-100 md:block" : "",
        )}
        onClick={handleBackBtn}
      >
        Voltar
      </Button>
    </main>
  );
}

export default App;

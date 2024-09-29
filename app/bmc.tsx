"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FileInput, FileOutput, PlusCircle, Printer } from "lucide-react";
import z from "zod";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "use-local-storage";

const schema = z.object({
  projectName: z.string(),
  sections: z.array(
    z.object({
      title: z.string(),
      notes: z.array(z.string()),
    })
  ),
});

const defaultSections = [
  { title: "Key Partners", notes: [] },
  { title: "Key Activities", notes: [] },
  { title: "Key Resources", notes: [] },
  { title: "Value Propositions", notes: [] },
  { title: "Customer Relationships", notes: [] },
  { title: "Channels", notes: [] },
  { title: "Customer Segments", notes: [] },
  { title: "Cost Structure", notes: [] },
  { title: "Revenue Streams", notes: [] },
];

type BMCSection = z.infer<typeof schema>["sections"][number];

export default function BusinessModelCanvas() {
  const [projectName, setProjectName] = useState("Untitled Project");
  const [sections, setSections] = useLocalStorage<BMCSection[]>(
    "bmc-cache",
    defaultSections
  );

  const { toast } = useToast();

  const addNote = (sectionIndex: number, note: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].notes.push(note);
    setSections(newSections);
  };

  const editNote = (
    sectionIndex: number,
    noteIndex: number,
    newNote: string
  ) => {
    const newSections = [...sections];
    newSections[sectionIndex].notes[noteIndex] = newNote;
    setSections(newSections);
  };

  const deleteNote = (sectionIndex: number, noteIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].notes.splice(noteIndex, 1);
    setSections(newSections);
  };

  const printCanvas = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${projectName} - Business Model Canvas</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
              .section { border: 1px solid #ccc; padding: 10px; page-break-inside: avoid; }
              .section.span-2 { grid-column: span 2; }
              .section.span-3 { grid-column: span 3; }
              h1 { text-align: center; }
              h2 { margin-top: 0; font-size: 14px; }
              ul { padding-left: 20px; margin: 5px 0; }
              li { font-size: 12px; }
              @media print {
                body { padding: 20px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>${projectName} - Business Model Canvas</h1>
            <div class="grid">
              ${sections
                .map(
                  (section, index) => `
                <div class="section ${index === 3 ? "span-2" : ""} ${
                    index > 6 ? "span-3" : ""
                  }">
                  <h2>${section.title}</h2>
                  <ul>
                    ${section.notes.map((note) => `<li>${note}</li>`).join("")}
                  </ul>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="no-print">
              <button onclick="window.print()">Print</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const saveCanvas = () => {
    const data = JSON.stringify({ projectName, sections });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, "_")}_BMC.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadCanvas = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const { data: content, error } = schema.safeParse(
            JSON.parse(e.target?.result as string)
          );
          if (error) {
            toast({
              title: "Invalid file format",
              variant: "destructive",
            });
            return;
          } else {
            setProjectName(content?.projectName ?? "Untitled Project");
            setSections(content?.sections ?? []);
          }
        } catch (error) {
          toast({
            title: "Error parsing file",
            variant: "destructive",
          });
          console.error("Error parsing file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="px-4 pt-4 min-h-dvh">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="text-xl md:text-2xl font-bold w-full md:w-1/2"
        />
        <div className="flex flex-wrap gap-2">
          <Button onClick={printCanvas} size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={saveCanvas} size="sm">
            <FileOutput className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => document.getElementById("file-upload")?.click()}
            size="sm"
          >
            <FileInput className="h-4 w-4 mr-2" />
            Import
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={loadCanvas}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {sections.map((section, index) => (
          <Card
            key={index}
            className={`col-span-1 ${
              index === 3 ? "xl:col-span-2 xl:row-span-2" : ""
            } ${index > 6 ? "xl:col-span-3" : ""}`}
          >
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 mb-2 space-y-1">
                {section.notes.map((note, noteIndex) => (
                  <li
                    key={noteIndex}
                    className="flex items-center justify-between"
                  >
                    <span className="mr-2 text-sm">{note}</span>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Edit Note</SheetTitle>
                        </SheetHeader>
                        <Textarea
                          className="min-h-[100px] my-4"
                          defaultValue={note}
                          onChange={(e) =>
                            editNote(index, noteIndex, e.target.value)
                          }
                        />
                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => deleteNote(index, noteIndex)}
                          >
                            Delete
                          </Button>
                          <SheetTrigger asChild>
                            <Button>Save</Button>
                          </SheetTrigger>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </li>
                ))}
              </ul>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem(
                    "note"
                  ) as HTMLInputElement;
                  if (input.value.trim()) {
                    addNote(index, input.value.trim());
                    input.value = "";
                  }
                }}
                className="flex items-center space-x-2"
              >
                <Input
                  type="text"
                  name="note"
                  placeholder="Add a note"
                  className="flex-grow text-sm"
                />
                <Button type="submit" size="sm">
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Add note</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center text-sm font-semibold text-muted-foreground py-4">
        <p>EasyBMC</p>
        <p>{new Date().getFullYear()} Patcharaphon Srida</p>
      </div>
    </div>
  );
}

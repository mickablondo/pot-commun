import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "dateFr",
  standalone: true,
})
export class DateFrPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return "";
    }

    const date = typeof value === "string" ? new Date(value) : value;
    if (isNaN(date.getTime())) {
      return "";
    }

    const day = `${date.getDate()}`.padStart(2, "0");
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}

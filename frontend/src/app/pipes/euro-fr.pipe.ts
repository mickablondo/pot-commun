import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "euroFr",
  standalone: true,
})
export class EuroFrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return "";
    }
    return value.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    });
  }
}

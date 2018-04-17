/**
Copyright 2018 Servelec Controls

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'ourSymbol',
  templateUrl: 'ourSymbol.component.html',
  styleUrls: ['ourSymbol.component.css']
})
export class OurSymbolComponent implements OnChanges {
  @Input() data: any;
  @Input() pathPrefix: string;
  buckets: number = 16;
  DataObject: { [k: string]: any } = {};
  ValueData: { [k: string]: any } = {};
  TrendData: { [k: string]: any } = {};
  HistogramData: { [k: string]: any } = {};
  BellCurveData: { [k: string]: any } = {};

  ngOnChanges(changes) {
    if (this.isDataValid()) {
      this.DataObject = this.formatData();
      this.ValueData = this.formatValueData();
      this.TrendData = this.formatTrendData();
      this.HistogramData = this.formatHistogramData();
      this.BellCurveData = this.formatBellCurve();
    }
  }

  formatData() {
    let data: { [k: string]: any } = {};
    let datasources: string[] = ["CenterLine", "ChartName", "LowerControlLimit", "LowerSpecificationLimit", "UpperControlLimit", "UpperSpecificationLimit", "PITagName", "Value", "YMin", "YMax"];
    for (let i = 0; i < this.data.body.length; i++) {
      for (let j = 0; j < datasources.length; j++) {
        if (this.data.body[i].path.endsWith("|" + datasources[j])) {
          data[datasources[j]] = this.data.body[i];
        }
      }
    }
    return data;
  }

  formatValueData() {
    let data: { [k: string]: any } = {};
    console.log(this.data);
    data["ChartTitle"] = this.DataObject.ChartName.events[0].value;
    data["Tag"] = this.DataObject.PITagName.events[0].value;
    data["Value"] = this.formatValue(this.DataObject.Value.events[this.DataObject.Value.events.length - 2].value);
    data["Time"] = this.formatUTCDate(this.DataObject.Value.events[this.DataObject.Value.events.length - 2].timestamp);
    data["Units"] = this.DataObject.Value.units;

    let vals: number[] = [];
    let total: number = 0;
    for (let i = 0; i < this.DataObject.Value.events.length; i++) {
      if (this.DataObject.Value.events[i].value && !this.DataObject.Value.events[i].value.Name) {
        vals.push(parseFloat(this.DataObject.Value.events[i].value));
        total += parseFloat(this.DataObject.Value.events[i].value);
      }
    }
    let mean: number = total / vals.length;
    let sum: number = 0;
    for (let i = 0; i < vals.length; i++) {
      sum += Math.pow(vals[i] - mean, 2);
    }
    data["SD"] = Math.sqrt(sum / vals.length);

    data["PP"] = Math.min(
      (parseFloat(this.getLastValue(this.DataObject.UpperSpecificationLimit.events).value) - mean) / (3 * data["SD"]),
      (mean - parseFloat(this.getLastValue(this.DataObject.LowerSpecificationLimit.events).value)) / (3 * data["SD"]));

    return data;
  }

  formatTrendData() {
    let data: { [k: string]: any } = {};
    let points: { [k: string]: any }[] = [];

    data["StartTime"] = this.formatUTCDate(this.data.startTime);
    data["EndTime"] = this.formatUTCDate(this.data.endTime);
    data["LoLo"] = parseFloat(this.getLastValue(this.DataObject.LowerSpecificationLimit.events).value);
    data["Lo"] = parseFloat(this.getLastValue(this.DataObject.LowerControlLimit.events).value);
    data["Mid"] = parseFloat(this.getLastValue(this.DataObject.CenterLine.events).value);
    data["Hi"] = parseFloat(this.getLastValue(this.DataObject.UpperControlLimit.events).value);
    data["HiHi"] = parseFloat(this.getLastValue(this.DataObject.UpperSpecificationLimit.events).value);

    let st = (new Date(data["StartTime"])).getTime();
    let et = (new Date(data["EndTime"])).getTime();
    let dur = et - st;
    for (let i = 0; i < this.DataObject.Value.events.length; i++) {
      if (this.DataObject.Value.events[i].value && !this.DataObject.Value.events[i].value.Name) {
        let val = parseFloat(this.DataObject.Value.events[i].value);
        let x = ((new Date(this.DataObject.Value.events[i].timestamp)).getTime() - st) / dur;
        points.push({
          value: val,
          x: x,
          alarm: val < data["LoLo"] ? 1 :
            val < data["Lo"] ? 2 :
              val > data["HiHi"] ? 4 :
                val > data["Hi"] ? 3 :
                  0
        });
        points[points.length - 1].alarm_color = this.getAlarmColor(points[points.length - 1].alarm);
      }
    }
    data["YMax"] = parseFloat(this.getLastValue(this.DataObject.YMax.events).value);
    data["YMin"] = parseFloat(this.getLastValue(this.DataObject.YMin.events).value);
    data["YRange"] = data["YMax"] - data["YMin"];
    data["Points"] = points;

    return data;
  }

  formatHistogramData() {
    let data: { [k: string]: any } = {};
    let vals: number[] = [];

    let min = Infinity;
    let max = -Infinity;

    for (let i = 0; i < this.DataObject.Value.events.length; i++) {
      if (this.DataObject.Value.events[i].value && !this.DataObject.Value.events[i].value.Name) {
        let val = parseFloat(this.DataObject.Value.events[i].value);
        vals.push(val);
        min = val < min ? val : min;
        max = val > max ? val : max;
      }
    }
    let range = max - min;

    let buckets: number[] = [];
    for (let i = 0; i < this.buckets; i++) {
      buckets.push(0);
    }
    for (let i = 0; i < vals.length; i++) {
      let bucket = Math.floor((vals[i] - min) / range * this.buckets);
      if (bucket >= this.buckets) { bucket = this.buckets - 1; }
      buckets[bucket]++;
    }

    data["MaxCount"] = -Infinity;
    for (let i = 0; i < this.buckets; i++) {
      data["MaxCount"] = buckets[i] > data["MaxCount"] ? buckets[i] : data["MaxCount"];
    }


    data["Min"] = min;
    data["Max"] = max;
    data["Buckets"] = buckets;
    return data;
  }

  formatBellCurve() {
    let data: { [k: string]: any } = {};

    let vals: number[] = [];
    let total: number = 0;
    for (let i = 0; i < this.DataObject.Value.events.length; i++) {
      if (this.DataObject.Value.events[i].value && !this.DataObject.Value.events[i].value.Name) {
        vals.push(parseFloat(this.DataObject.Value.events[i].value));
        total += parseFloat(this.DataObject.Value.events[i].value);
      }
    }
    let mean: number = total / vals.length;
    let sum: number = 0;
    for (let i = 0; i < vals.length; i++) {
      sum += Math.pow(vals[i] - mean, 2);
    }
    let SD: number = Math.sqrt(sum / vals.length);

    let points: number[] = [];
    let max: number = 0;
    for (let i = 0; i < 101; i++) {
      let x = this.HistogramData["Min"] + i * (this.HistogramData["Max"]-this.HistogramData["Min"]) / 100;
      points.push((1 / (SD * Math.sqrt(2 * Math.PI))) * Math.pow(Math.E, (-0.5 * Math.pow((x - mean) / SD, 2))));
      max = points[i-1] > max ? points[i-1] : max;
    }
    data["Max"] = max;
    data["Points"] = points;
    return data;
  }

  private formatValue(value: any) {
    // very basic enumeration support
    if (value.Name) {
      return value.Name;
    }

    return value;
  }

  private getLastValue(values: any) {
    for (let i = values.length - 1; i > -1; i--) {
      if (values[i].value && !values[i].value.Name) {
        return values[i];
      }
    }
  }

  private getAlarmColor(value: number) {
    switch (value) {
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "orange";
      case 4:
        return "red";
      default:
        return "none";
    }
  }

  private isDataValid(): boolean {
    return this.data && this.data.body && this.data.body.length;
  }

  private formatUTCDate(value: string): string {
    return (new Date(value)).toLocaleString();
  }
}

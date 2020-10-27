import { Pipe, PipeTransform } from '@angular/core';
import { JsonObject } from '../models/json-object.model';

import * as _ from 'lodash';
import { getName } from '../helpers/field-name.helper';
import { getInvertedColumns } from '../helpers/inverted-columns.helper';

@Pipe({
  name: 'tableLayout',
})
export class TableLayoutPipe implements PipeTransform {
  /**
   * this is the pipe responsible for creating the table object
   *
   * @param json json object from which the table is created
   * @param isInverted a boolean that specifies the orientation of the table
   */
  transform(
    json: JsonObject,
    isInverted: boolean = false
  ): { tableHeaders: string[]; tableRows: Array<string[]> } {
    let tableHeaders = [];

    const tableType = !isInverted
      ? `${json.metaData.names.ou} vs ${json.metaData.names.dx}`
      : `${json.metaData.names.dx} vs ${json.metaData.names.ou}`;
    const otherColumns = _.map(
      !isInverted ? json.metaData.dimensions.ou : json.metaData.dimensions.dx,
      (ou) => {
        return getName(ou, json);
      }
    );
    tableHeaders = [tableType, ...otherColumns];

    const tableRows = !isInverted
      ? _.map(json.rows, (row) => {
          return [getName(row[0], json), row[2]];
        })
      : getInvertedColumns(json);

    const table = {
      tableHeaders,
      tableRows,
    };
    return table;
  }
}

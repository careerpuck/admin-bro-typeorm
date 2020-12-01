import _ from "lodash";
import * as flat from "flat";
import { BaseRecord, CurrentAdmin } from "admin-bro";
import RecordJSON from "admin-bro/types/src/backend/decorators/record-json.interface";
import { BaseEntity } from "typeorm";
import { Resource } from "./Resource";

export class ExtendedRecord extends BaseRecord
{
    private _instance: Record<string, any> | null = null;

    constructor(instance: Record<string, any>, resource: Resource)
    {
        super(instance, resource);

        if(instance)
            this._instance = instance;
    }

    public toJSON(currentAdmin?: CurrentAdmin): RecordJSON
    {
        const obj = super.toJSON(currentAdmin);
        if(this._instance)
        {
            // patched strange objects ({"key.deepKey": 123}) to normal JSON.
            obj.params = {};
            for (const n in this._instance)
            {
                const value = this._instance[n];
                const property = this.resource.property(n);
                if(property)
                {
                    const type = property.type() as any;
                    if (type == "array" || property.isArray()) {
                        if (value) {
                            value.forEach((v, i) => {
                                obj.params[`${n}.${i}`] = v;
                            });                    
                        }
                    }                    
                    if(type == "mixed") {
                        obj.params[n] = JSON.stringify(value);
                    }
                    else {
                        obj.params[n] = value;
                    }
                }
            }
        }

        return obj;
    }

    public storeParams(payloadData?: object): void {        
        this.params = _.merge(this.params, payloadData ? flat.flatten(payloadData) : {});        
    }       
}

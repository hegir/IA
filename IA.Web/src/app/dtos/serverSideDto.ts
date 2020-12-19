import { ServerSideTotalsDto } from "./serverSideTotalsDto";

export class ServerSideDto<T>
{
    Data: T[];
    Count: number;
    Total: ServerSideTotalsDto;

    constructor()
    {
        this.Data = new Array();
        this.Count = 0;
        this.Total = new ServerSideTotalsDto();
    }
}

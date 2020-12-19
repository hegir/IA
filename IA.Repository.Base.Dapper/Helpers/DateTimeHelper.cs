using Dapper;
using System;

namespace IA.Repository.Base.Dapper.Helpers
{
    public class DateTimeHelper : SqlMapper.TypeHandler<DateTime>
    {
        public override void SetValue(System.Data.IDbDataParameter parameter, DateTime value)
        {
            parameter.Value = value;
        }

        public override DateTime Parse(object value)
        {
            DateTime dateTime = DateTime.SpecifyKind((DateTime)value, DateTimeKind.Utc);
            return dateTime;
        }
    }
}
using System.Collections.Generic;

namespace IA.DTOs
{
    public class ServerSideDto<T>
    {
        public List<T> Data { get; set; }
        public int Count { get; set; }

        public ServerSideDto()
        {
            Data = new List<T>();
            Count = 0;
        }
    }
}
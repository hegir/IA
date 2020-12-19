using IA.Repository.Base;
using IA.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace IA.Repository
{
    public interface IRepositoryRefreshToken : IRepositoryBase<string,RefreshToken>
    {
        void DeleteAll(int id);
    }
}

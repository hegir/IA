using IA.Repository.Base;
using Microsoft.AspNetCore.Mvc;
using IA.DTOs;
using IA.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace IA.Repository
{
    public interface IRepositoryUser: IRepositoryBase<int, User>
    {
        IEnumerable<User> FindAll(int limit, int offset, string sortingColumn, int order, string searchText, int? cityId);
        int CountAll(string searchText, int? cityId);

    }
}

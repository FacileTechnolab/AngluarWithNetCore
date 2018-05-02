using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using app3.Data;
using app3.Code;
using app3.Model;
using System.Linq.Expressions;




namespace app3.Controllers
{

	public class EmployeesController : Controller
	{
		private readonly EmployeeContext _context;

		public EmployeesController(EmployeeContext context)
		{
			_context = context;
		}


		[HttpGet]
		[Route("/api/employees/search")]
		public IActionResult Search(string searchTerm, int? skip, string SortBy, string sortOrder, string filter, string filterkey)
	{

			IQueryable<Employee> employeeList = null;
			List<Employee> emplist = null;
			if (skip == null)
			{
				skip = 0;
			}
			var pageSize = 10;
			var totalCout = _context.Employees.Count();
			var list = (from p in _context.Employees select p);
			if (skip >= totalCout)
			{
				skip = (totalCout - pageSize) < 0 ? 0 : totalCout - pageSize;
			}
			if (string.IsNullOrEmpty(searchTerm) && string.IsNullOrEmpty(filter))
			{
				//List<Employee> employeelist = null;
				emplist = Sorting(list, SortBy, sortOrder, Convert.ToInt32(skip), pageSize);

				return new ObjectResult(new PageList<Employee>
				{
					PageSize = pageSize,
					CurrentPage = ((int)skip / pageSize) + 1,
					Result = emplist,
					TotalRecord = totalCout,
					StartPage = skip + 1,
				});
			}
			else if ((!string.IsNullOrEmpty(searchTerm)) && string.IsNullOrEmpty(filter))
			{
			 
				employeeList = list.Where(x => x.FirstName.Contains(searchTerm)
										   || x.LastName.Contains(searchTerm)
										   || x.Department.Contains(searchTerm)
										   || x.Email.Contains(searchTerm)
										   || x.JobTitle.Contains(searchTerm)
										);

				emplist = Sorting(employeeList, SortBy, sortOrder, Convert.ToInt32(skip), pageSize);
				var r = new ObjectResult(new PageList<Employee>
				{
					PageSize = pageSize,
					CurrentPage = ((int)skip / pageSize) + 1,
					Result = emplist,
					TotalRecord = totalCout,
					StartPage = skip + 1,

				});
				return r;
			}
			else if (filter != null && filterkey != null)
			{
				 
				employeeList = _context.Employees.Where(MakeFilter(filterkey, searchTerm, filter));
				emplist = Sorting(employeeList, SortBy, sortOrder, Convert.ToInt32(skip), pageSize);
				var result = new ObjectResult(new PageList<Employee>
				{
					PageSize = pageSize,
					CurrentPage = (Convert.ToInt32(skip) / pageSize) + 1,
					Result = emplist, 
					TotalRecord = totalCout,
					StartPage = skip + 1,

				});
				return result;

			}
			else
			{
				list.Skip(0).Take(pageSize).ToList();
				return new ObjectResult(new PageList<Employee>
				{
					PageSize = pageSize,
					CurrentPage = (Convert.ToInt32(skip) / pageSize) + 1,
					Result = list,
					TotalRecord = totalCout,
					StartPage = skip + 1,
				});
			}
		}

		public List<Employee> Sorting(IQueryable<Employee> list, string SortBy, string sortOrder, int skip, int take)
		{

			List<Employee> emplist = null;

			if (!string.IsNullOrEmpty(SortBy))
			{

				switch (SortBy.ToLower())
				{
					case "firstname":
						{
							emplist = sortOrder.ToLower() == "desc" ? list.OrderByDescending(item => item.FirstName).Skip(skip).Take(take).ToList() : list.OrderBy(x => x.FirstName).Skip(skip).Take(take).ToList();
							break;
						}
					case "lastname":
						{
							emplist = sortOrder.ToLower() == "desc" ? list.OrderByDescending(item => item.LastName).Skip(skip).Take(take).ToList() : list.OrderBy(x => x.LastName).Skip(skip).Take(take).ToList();
							break;
						}
					case "email":
						{
							emplist = sortOrder.ToLower() == "desc" ? list.OrderByDescending(item => item.Email).Skip(skip).Take(take).ToList() : list.OrderBy(x => x.Email).Skip(skip).Take(take).ToList();
							break;
						}
					case "jobtitle":
						{
							emplist = sortOrder.ToLower() == "desc" ? list.OrderByDescending(item => item.JobTitle).Skip(skip).Take(take).ToList() : list.OrderBy(x => x.JobTitle).Skip(skip).Take(take).ToList();
							break;
						}
					case "department":
						{
							emplist = sortOrder.ToLower() == "desc" ? list.OrderByDescending(item => item.Department).Skip(skip).Take(take).ToList() : list.OrderBy(x => x.Department).Skip(skip).Take(take).ToList();
							break;
						}
					default:
						emplist = sortOrder.ToLower() == "desc" ? list.OrderByDescending(item => item.FirstName).Skip(skip).Take(take).ToList() : list.OrderBy(x => x.FirstName).Skip(skip).Take(take).ToList();
						break;
				}
			}
			else
			{
				emplist = list.OrderBy(x => x.FirstName).Skip(skip).Take(take).ToList();
			}
			return emplist;


		}

		static Expression<Func<Employee, bool>> MakeFilter(string propertyName, object value, string filter)
		{
			if (!string.IsNullOrEmpty(propertyName))
			{
				propertyName = char.ToUpper(propertyName[0]) + propertyName.Substring(1);
			}
			if (!string.IsNullOrEmpty(filter))
			{
				filter = char.ToUpper(filter[0]) + filter.Substring(1);
			}

			if (!string.IsNullOrEmpty(propertyName))
			{
				propertyName = char.ToUpper(propertyName[0]) + propertyName.Substring(1);
			}
			var type = typeof(Employee);

			var property = type.GetProperty(propertyName);

			var parameter = Expression.Parameter(type, "p");
			var propertyAccess = Expression.MakeMemberAccess(parameter, property);
			var constantValue = Expression.Constant(value);
			var equality = Expression.ReferenceEqual(propertyAccess, constantValue);

			if (filter == "Equals")
			{
				return Expression.Lambda<Func<Employee, bool>>(equality, parameter);
			}

			else if (filter == "NotEqual")
			{
				var notequal = Expression.NotEqual(propertyAccess, constantValue);
				return Expression.Lambda<Func<Employee, bool>>(notequal, parameter);
			}
			else if (filter == "StartsWith" || filter == "EndsWith" || filter == "Contains")
			{
				var methoInfo = typeof(string).GetMethod(filter, new Type[] { typeof(string) });
				Expression call = Expression.Call(propertyAccess, methoInfo, constantValue);
				return Expression.Lambda<Func<Employee, bool>>(call, parameter);
			}

			return Expression.Lambda<Func<Employee, bool>>(equality, parameter);
		}
	}

}

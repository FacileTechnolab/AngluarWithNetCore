using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace app3.Code
{
	public class PageList<T> where T : class
	{
		public int PageSize { get; set; }
		public IEnumerable<T> Result { get; set; }
		public int ResultCount
		{
			get
			{

				if (Result == null)
				{
					return 0;
				}
				else
				{
					return Result.Count();
				}
			}
		}
		public int TotalRecord { get; set; }
		public int TotalPage { get { return (int)Math.Ceiling((double)TotalRecord / (double)PageSize); } }
		public int CurrentPage { get; set; }
		public int? StartPage { get; set; }
		public int? EndPage
		{
			get
			{
				if (Result == null)
				{
					return StartPage - 1 + 0;
				}
				else
				{
					return StartPage - 1 + Result.Count();				
				}
			}
		}
	}
}

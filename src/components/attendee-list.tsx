import {Search, MoreHorizontal, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,} from "lucide-react";
import { IconButton } from "./icon-button";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { TableRow } from "./table/table-row";
import { ChangeEvent, useEffect, useState } from "react";
import dayjs from "dayjs"
import relativeTme from "dayjs/plugin/relativeTime"
import  "dayjs/locale/pt-br"

dayjs.extend(relativeTme)
dayjs.locale("pt-br")

interface Attendee{
  id: string,
  name: string,
  email: string,
  createdAt: string,
  checkedInAt: string | null
}

export function AttendeeList() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const totalPages = Math.ceil(total / 10)

  useEffect(()=>{
    const url = new URL("http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees")

    url.searchParams.set("pageIndex", String(page - 1))
    
    if(search.length > 0){
      url.searchParams.set("query", search)
    }
   
    fetch(url)
    .then(response => response.json())
    .then(data => {
      setAttendees(data.attendees)
      setTotal(data.total)
    })
  },[page, search])

  function onSerachInputChanged(event: ChangeEvent<HTMLInputElement>){
   setSearch(event.target.value)
   setPage(1)
  }

  function goToNextPage(){
    setPage(page +1)
  }

  function goToPreviusPage(){
    setPage(page -1)
  }
  
  function goToLastPage(){
    setPage(totalPages)
  }

  function goToFirstPage(){
    setPage(1)
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center  ">
        <h1 className="text-2xl font-bold ">Participantes</h1>
        <div className="px-3 w-72 py-1.5 border border-white/10  rounded-lg text-sm flex items-center gap-3 ">
          <Search className="size-4 text-emerald-300" />
          <input onChange={onSerachInputChanged} className="bg-transparent flex-1 outline-none"placeholder="Buscar Participantes"/>
        </div>
       
      </div>
      <Table>
          <thead>
              <tr className="border-b border-white/10">
                <TableHeader style={{ width: 48 }}>
                  <input type="checkbox" />
                </TableHeader>
                <TableHeader>Código</TableHeader>
                <TableHeader>Participantes</TableHeader>
                <TableHeader>Data de inscrição </TableHeader>
                <TableHeader>Data do check-in</TableHeader>
                <TableHeader style={{ width: 64 }}></TableHeader>
              </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => {
              return (
                <TableRow key={attendee.id} >
                  <TableCell><input type="checkbox" /></TableCell>
                  <TableCell>{attendee.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-white">{attendee.name}</span>
                      <span>{attendee.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                  <TableCell>{attendee.checkedInAt === null
                   ? <span className="text-zinc-400">Não fez check-in</span>
                   : dayjs().to(attendee.checkedInAt)}
                   </TableCell>
                  <TableCell >
                    <IconButton transparent>
                      <MoreHorizontal className="size-4 " />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <TableCell colSpan={3}>Mostrando {attendees.length}  de {total} itens</TableCell>
              <TableCell className="text-right" colSpan={3}>
                <div className="inline-flex items-center gap-8">
                  <span>Página {page} de {totalPages}</span>
                  <div className="flex gap-1.5">
                    <IconButton onClick={goToFirstPage}disabled={page === 1} >
                      <ChevronsLeft className="size-4 " />
                    </IconButton>
                    <IconButton onClick={goToPreviusPage} disabled={page === 1} >
                      <ChevronLeft className="size-4 " />
                    </IconButton>
                    <IconButton onClick={goToNextPage} disabled={page === totalPages} >
                      <ChevronRight className="size-4 " />
                    </IconButton>
                    <IconButton onClick={goToLastPage} disabled={page === totalPages} >
                      <ChevronsRight className="size-4 " />
                    </IconButton>
                  </div>
                </div>
              </TableCell>
            </tr>
          </tfoot>
        </Table>
      </div>
    
  );
}

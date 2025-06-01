using API.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;

namespace API.Controllers;

public class PollOptionController : GenericController<PollOption, PollOptionReadDto, PollOptionCreateDto, PollOptionUpdateDto>
{
    public PollOptionController(IGenericService<PollOption> service, ILogger<GenericController<PollOption, PollOptionReadDto, PollOptionCreateDto, PollOptionUpdateDto>> logger, IMapper mapper) : base(service, logger, mapper)
    {
    }
}
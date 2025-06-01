using API.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain.Entities;

namespace API.Controllers;

public class PollController : GenericController<Poll, PollReadDto, PollCreateDto, PollUpdateDto>
{
    public PollController(IGenericService<Poll> service, ILogger<GenericController<Poll, PollReadDto, PollCreateDto, PollUpdateDto>> logger, IMapper mapper) : base(service, logger, mapper)
    {
    }
}
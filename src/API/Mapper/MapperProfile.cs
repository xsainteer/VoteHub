using API.DTOs;
using AutoMapper;
using Domain.Entities;

namespace API.Mapper;

public class MapperProfile : Profile
{
    public MapperProfile()
    {
        // Poll mappings
        CreateMap<Poll, PollReadDto>()
            .ForMember(dest => dest.Options,
                opt => opt.MapFrom(src => src.Options));

        CreateMap<PollCreateDto, Poll>();
        CreateMap<PollUpdateDto, Poll>() 
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null)); // Prevent overwriting with null values

        // PollOption mappings
        CreateMap<PollOption, PollOptionReadDto>();

        CreateMap<PollOptionCreateDto, PollOption>();
        CreateMap<PollOptionUpdateDto, PollOption>().ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Vote mappings
        CreateMap<Vote, VoteReadDto>()
            .ReverseMap();

        CreateMap<VoteCreateDto, Vote>();
        CreateMap<VoteUpdateDto, Vote>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null)); // Ignore null values in UpdateDto
    }
}

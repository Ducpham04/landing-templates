package vn.leadhub.user;

import org.mapstruct.Mapper;
import vn.leadhub.user.UserDtos.AssigneeDto;
import vn.leadhub.user.UserDtos.UserDto;

@Mapper
public interface UserMapper {
  UserDto toDto(User user);

  AssigneeDto toAssignee(User user);
}
